from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.daily_targets import PlanCompletion,DailyPlan

from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.daily_targets import PlanCompletion, DailyPlan


def get_last_plan_completion(db: Session, user_id: int):

    completion = (
        db.query(PlanCompletion)
        .join(DailyPlan, DailyPlan.id == PlanCompletion.plan_id)
        .filter(DailyPlan.user_id == user_id)
        .order_by(desc(DailyPlan.date))
        .first()
    )

    if not completion:
        return {
            "vocab_done": 0,
            "kanji_done": 0,
            "grammar_done": 0,
            "reading_minutes_done": 0,
            "listening_minutes_done": 0,
            "completed": False
        }

    return {
        "vocab_done": completion.vocab_done,
        "kanji_done": completion.kanji_done,
        "grammar_done": completion.grammar_done,
        "reading_minutes_done": completion.reading_minutes_done,
        "listening_minutes_done": completion.listening_minutes_done,
        "completed": completion.completed
    }