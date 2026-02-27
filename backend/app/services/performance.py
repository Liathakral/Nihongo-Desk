from sqlalchemy.orm import Session


from schemas.performance import PerformanceLogCreate
from models.performance import PerformanceLog
def create_performance_log(
    db: Session,
    data: PerformanceLogCreate
) -> PerformanceLog:
    log = PerformanceLog(
        session_id=data.session_id,
        perceived_performance=data.perceived_performance,
        primary_struggle=data.primary_struggle,
        focus_level=data.focus_level,
        difficulty_level=data.difficulty_level,
        confidence_rating=data.confidence_rating,
        reflection_note=data.reflection_note,
    )
    db.add(log)
    db.commit()
    db.refresh(log)

    return log
