from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from services.dependencies import get_current_user
from models.insights import Insight
from schemas.insights import InsightResponse
from services.insights import generate_insights

router = APIRouter(prefix="/insights", tags=["insights"])


@router.get("/active", response_model=list[InsightResponse])
def get_active_insights(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return (
        db.query(Insight)
        .filter(
            Insight.user_id == user.id,
            Insight.is_active == True
        )
        .order_by(Insight.severity.desc())
        .limit(3)
        .all()
    )


@router.post("/analyze")
def analyze_user_insights(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    generate_insights(db, user.id)
    return {"status": "analysis complete"}
