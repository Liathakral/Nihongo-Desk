from sqlalchemy.orm import Session
from app.models.study_profile import StudyProfile


def get_study_profile(db: Session, user_id: int) -> StudyProfile:

    profile = (
        db.query(StudyProfile)
        .filter(StudyProfile.user_id == user_id)
        .first()
    )

    if not profile:
        raise ValueError("Study profile not found")

    return profile