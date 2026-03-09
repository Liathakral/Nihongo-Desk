from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.daily_targets import PlanCompletion,DailyPlan



def get_last_plan_completion(db: Session, user_id: int):

    completion = (
        db.query(PlanCompletion)
        .join(DailyPlan, DailyPlan.id == PlanCompletion.plan_id)
        .filter(DailyPlan.user_id == user_id)
        .order_by(desc(DailyPlan.date))
        .first()
    )

    return completion