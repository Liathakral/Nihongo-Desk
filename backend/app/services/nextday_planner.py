from datetime import date
import json
from fastapi import logger
from sqlalchemy.orm import Session

from app.services.plan_completion import get_last_plan_completion
from app.services.study_profile import get_study_profile
from app.core.openai_client import client


JLPT_REQUIREMENTS = {
    "N5": {"vocab": 800, "kanji": 100, "grammar": 80},
    "N4": {"vocab": 1500, "kanji": 300, "grammar": 120},
    "N3": {"vocab": 3700, "kanji": 650, "grammar": 200},
    "N2": {"vocab": 6000, "kanji": 1000, "grammar": 300},
    "N1": {"vocab": 10000, "kanji": 2000, "grammar": 400},
}


def generate_daily_plan(db: Session, user_id: int, velocity: dict) -> dict:

    profile = get_study_profile(db, user_id)

    completion = get_last_plan_completion(db, user_id)

    req = JLPT_REQUIREMENTS[profile.jlpt_level]

    days_remaining = (profile.target_exam_date - date.today()).days
    if days_remaining <= 0:
        days_remaining = 1

    remaining_vocab = max(req["vocab"] - profile.vocab_known, 0)
    remaining_kanji = max(req["kanji"] - profile.kanji_known, 0)

    vocab_min_daily = max(5, remaining_vocab // days_remaining)
    kanji_min_daily = max(2, remaining_kanji // days_remaining)

    # fallback velocity for new users
    vocab_velocity = velocity["vocab_per_day"] if velocity else vocab_min_daily
    kanji_velocity = velocity["kanji_per_day"] if velocity else kanji_min_daily
    vocab_time = vocab_min_daily * 1
    kanji_time = kanji_min_daily * 3
    grammar_time = 3 * 5   # assume average grammar target

    estimated_core_time = vocab_time + kanji_time + grammar_time

    remaining_time = max(profile.daily_study_minutes - estimated_core_time, 10)
    # fallback completion
    if not completion:
        completion = {
            "vocab_done": 0,
            "kanji_done": 0
        }

    prompt = f"""
You are an AI JLPT study planner.

User level: {profile.jlpt_level}

Days until exam: {days_remaining}

Learning velocity:
vocab/day = {vocab_velocity}
kanji/day = {kanji_velocity}

Remaining workload:
vocab remaining = {remaining_vocab}
kanji remaining = {remaining_kanji}

Minimum daily targets required:
vocab/day = {vocab_min_daily}
kanji/day = {kanji_min_daily}

Yesterday completion:
vocab_done = {completion["vocab_done"]}
kanji_done = {completion["kanji_done"]}


Daily study time available:
{profile.daily_study_minutes} minutes

Planning strategy:

- Base targets on user learning velocity.
- Increase workload slightly if yesterday's targets were completed.
- Reduce workload if yesterday was incomplete.
- Grammar must always be between 1 and 5 patterns.


Core study time is already allocated for:

-vocab study
-kanji study
-grammar study

-Remaining time available for reading and listening:
{remaining_time} minutes

Your task:
-Split this remaining time between reading and listening practice.

Rules:
- reading_minutes + listening_minutes MUST equal {remaining_time}
- reading should be slightly higher for N3+
- listening should be higher for N5–N4
- Total estimated time must not exceed {profile.daily_study_minutes}.

Return ONLY valid JSON in this format:

{{
"vocab_target": int,
"kanji_target": int,
"grammar_target": int,
"reading_minutes": int,
"listening_minutes": int,

}}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You generate structured JLPT study plans."},
            {"role": "user", "content": prompt}
        ]
    )

    content = response.choices[0].message.content
    print(content)

    try:
        plan = json.loads(content)
    except Exception:
        logger.error("AI returned invalid JSON")
        raise

    return plan