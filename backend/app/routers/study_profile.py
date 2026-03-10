from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.db.database import get_db
from app.services.dependencies import get_current_user

from app.schemas.study_profile import (
    StudyProfileCreate,
    StudyProfileResponse
)

from app.services.study_profile import (
    create_study_profile,
    get_study_profile
)

from app.core.queue import insight_queue
from app.workers.daily_plan import generate_next_day_plan


router = APIRouter()


@router.post("/", response_model=StudyProfileResponse)
def create_profile(
    data: StudyProfileCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):

    existing = get_study_profile(db, user.id)

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Study profile already exists"
        )
        

    profile = create_study_profile(db, user.id, data)

  
    insight_queue.enqueue(
        generate_next_day_plan,
        user.id,
        date.today()
        
    )

    return profile


@router.get("/", response_model=StudyProfileResponse)
def read_profile(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):

    profile = get_study_profile(db, user.id)

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Study profile not found"
        )

    return profile