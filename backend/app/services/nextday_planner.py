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

def generate_daily_plan(db: Session, user_id: int, velocity: dict):

    profile = get_study_profile(db, user_id)

    completion = get_last_plan_completion(db, user_id)

    req = JLPT_REQUIREMENTS[profile.jlpt_level]

    days_remaining = (profile.exam_date - date.today()).days

    if days_remaining <= 0:
        days_remaining = 1

    remaining_vocab = max(req["vocab"] - profile.vocab_known, 0)
    remaining_kanji = max(req["kanji"] - profile.kanji_known, 0)

    vocab_min_daily = max(5, remaining_vocab // days_remaining)
    kanji_min_daily = max(2, remaining_kanji // days_remaining)

    prompt = f"""
You are an AI JLPT study planner.

User level: {profile.jlpt_level}

Days until exam: {days_remaining}



Learning velocity:
vocab/day = {velocity["vocab_per_day"]}
kanji/day = {velocity["kanji_per_day"]}

Remaining workload:
vocab remaining = {remaining_vocab}
kanji remaining = {remaining_kanji}

Minimum daily targets required:
vocab/day = {vocab_min_daily}
kanji/day = {kanji_min_daily}

Yesterday completion:
vocab_done = {completion.vocab_done if completion else 0}
kanji_done = {completion.kanji_done if completion else 0}

Daily study time available:
{profile.daily_study_minutes} minutes

Rules:
- Meet or exceed minimum daily targets.
- Prioritize the weakest area.
- Avoid drastic increases from yesterday.
- Keep the study load within daily time.
- Maintain balance between vocabulary, kanji, grammar, reading, listening.

Return ONLY valid JSON in this format:

{{
"vocab_target": int,
"kanji_target": int,
"grammar_target": int,
"reading_minutes": int,
"listening_minutes": int,
"focus_area": "string"
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

    try:
        plan = json.loads(content)
    except Exception:
        logger.error("AI returned invalid JSON")
        raise

    return plan