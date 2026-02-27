from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from services.dependencies import get_current_user
from services.timeline import get_user_timeline
from schemas.timeline import TimelineAnalytics
from typing import List
router = APIRouter(prefix="/timeline", tags=["timeline"])


@router.get("/")
def timeline(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    response_model=TimelineAnalytics
):
    return get_user_timeline(db, user.id)
