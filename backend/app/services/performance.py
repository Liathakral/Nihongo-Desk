from sqlalchemy.orm import Session


from app.schemas.performance import PerformanceLogCreate
from app.models.performance import PerformanceLog
def create_performance_log(
    db: Session,
    data: PerformanceLogCreate
) -> PerformanceLog:
    log = PerformanceLog(
        session_id=data.session_id,
        perceived_performance=data.perceived_performance,
        focus_level=data.focus_level,
        difficulty_level=data.difficulty_level,
        primary_struggle=data.primary_struggle,
        activity_source=data.activity_source,
        note=data.note
        
    )
    db.add(log)
    db.commit()
    db.refresh(log)

    return log
