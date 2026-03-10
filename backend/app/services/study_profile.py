from sqlalchemy.orm import Session
from app.models.study_profile import StudyProfile
from sqlalchemy.orm import Session
from app.models.study_profile import StudyProfile


def create_study_profile(db: Session, user_id: int, data):

    profile = StudyProfile(
        user_id=user_id,
        jlpt_level=data.jlpt_level,
        target_exam_date=data.target_exam_date,
        daily_study_minutes=data.daily_study_minutes,
        vocab_known=data.vocab_known,
        kanji_known=data.kanji_known,
        grammar_known=data.grammar_known
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile



def get_study_profile(db: Session, user_id: int):

    profile = (
        db.query(StudyProfile)
        .filter(StudyProfile.user_id == user_id)
        .first()
    )
    return profile