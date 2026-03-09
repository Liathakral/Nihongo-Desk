from datetime import date, timedelta
from sqlalchemy.orm import Session

from app.models.daily_targets import DailyPlan


def save_daily_plan(db: Session, user_id: int, plan: dict):

    tomorrow = date.today() + timedelta(days=1)

    existing = (
        db.query(DailyPlan)
        .filter(
            DailyPlan.user_id == user_id,
            DailyPlan.date == tomorrow
        )
        .first()
    )

    if existing:
        return existing

    new_plan = DailyPlan(
        user_id=user_id,
        date=tomorrow,
        vocab_target=plan["vocab_target"],
        kanji_target=plan["kanji_target"],
        grammar_target=plan["grammar_target"],
        reading_minutes=plan["reading_minutes"],
        listening_minutes=plan["listening_minutes"],
    )

    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)

    return new_plan