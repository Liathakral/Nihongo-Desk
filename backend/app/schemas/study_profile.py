from pydantic import BaseModel
from datetime import datetime
from app.models.study_profile import JLPTLevel


class StudyProfileCreate(BaseModel):

    jlpt_level: JLPTLevel
    target_exam_date: datetime
    daily_study_minutes: int

    vocab_known: int = 0
    kanji_known: int = 0
    grammar_known: int = 0


class StudyProfileResponse(BaseModel):

    id: int
    jlpt_level: JLPTLevel
    target_exam_date: datetime
    daily_study_minutes: int

    vocab_known: int
    kanji_known: int
    grammar_known: int

    class Config:
        from_attributes = True