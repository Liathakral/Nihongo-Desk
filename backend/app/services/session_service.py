from sqlalchemy.orm import Session
from models.study_session import StudySession



def create_study_session(
    db: Session,
    user_id: int,
    data: StudySessionCreate
) -> StudySession:
    session = StudySession(
        user_id=user_id,
        skill_type=data.skill_type,
        started_at=data.started_at,
        ended_at=data.ended_at,
        duration_minutes=int((data.ended_at - data.started_at).total_seconds() / 60),
        time_of_day_bucket=data.time_of_day_bucket,
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session

