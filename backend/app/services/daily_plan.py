from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.models.daily_targets import DailyPlan


def save_daily_plan(db: Session, user_id: int, plan: dict,plan_date:date):
    print("SAVE DAILY PLAN CALLED")
    print("USER:", user_id)
    print("PLAN DATE:", plan_date)
    print("PLAN:", plan)
    try:
    
        required_fields = [
            "vocab_target",
            "kanji_target",
            "grammar_target",
            "reading_minutes",
            "listening_minutes",
        ]

        for field in required_fields:
            if field not in plan:
                raise ValueError(f"Missing field in AI plan: {field}")

        existing = (
            db.query(DailyPlan)
            .filter(
                DailyPlan.user_id == user_id,
                DailyPlan.date == plan_date
            )
            .first()
        )

        if existing:
            return existing
       
        new_plan = DailyPlan(
            user_id=user_id,
            date=plan_date,
            vocab_target=int(plan["vocab_target"]),
            kanji_target=int(plan["kanji_target"]),
            grammar_target=int(plan["grammar_target"]),
            reading_minutes=int(plan["reading_minutes"]),
            listening_minutes=int(plan["listening_minutes"]),
        )
        print(new_plan,"new plan")

        db.add(new_plan)
        db.commit()
        db.refresh(new_plan)

        return new_plan

    except Exception as e:
        db.rollback()
        print("Daily plan save error:", e)
        raise