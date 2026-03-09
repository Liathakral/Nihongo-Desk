from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.workers.daily_plan import generate_next_day_plan
from app.core.queue import insight_queue
from app.db.database import get_db
from app.services.dependencies import get_current_user
from app.models.daily_targets import DailyPlan, PlanCompletion
from app.schemas.dailyplan import DailyPlanResponse, PlanCompletionResponse, PlanCompletionUpdate

router = APIRouter()


@router.get("/today", response_model=DailyPlanResponse)
def get_today_plan(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    today = date.today()

    plan = (
        db.query(DailyPlan)
        .filter(
            DailyPlan.user_id == user.id,
            DailyPlan.date == today
        )
        .first()
    )

    if not plan:
        raise HTTPException(
            status_code=404,
            detail="No study plan for today"
        )

    return plan

@router.patch("/{plan_id}", response_model=PlanCompletionResponse)
def update_completion(
    plan_id: int,
    data: PlanCompletionUpdate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):

    plan = (
        db.query(DailyPlan)
        .filter(
            DailyPlan.id == plan_id,
            DailyPlan.user_id == user.id
        )
        .first()
    )

    if not plan:
        raise HTTPException(
            status_code=404,
            detail="Plan not found"
        )

    completion = (
        db.query(PlanCompletion)
        .filter(PlanCompletion.plan_id == plan_id)
        .first()
    )

    if not completion:
        completion = PlanCompletion(plan_id=plan_id)
        db.add(completion)

    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(completion, field, value)

    db.commit()
    db.refresh(completion)
    insight_queue.enqueue(
    generate_next_day_plan,
    user.id
    )

    return completion