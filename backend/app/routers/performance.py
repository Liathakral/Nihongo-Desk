
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.dependencies import get_current_user

from app.schemas.performance import PerformanceLogCreate, PerformanceLogResponse
from app.services.performance import create_performance_log
from app.core.queue import insight_queue
from app.workers.insight_worker import analyze_user_learning

router = APIRouter(prefix="/performance", tags=["performance"])


@router.post("/", response_model=PerformanceLogResponse)
def log_performance(
    data: PerformanceLogCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    log = create_performance_log(db, data)

    # 🔥 Enqueue background analysis
    print("ENQUEUE CALLED FOR USER:", user.id)

    job = insight_queue.enqueue(
        analyze_user_learning,
        user.id
    )
    print("JOB ID:", job.id)


    return log
