from pydantic import BaseModel
from datetime import datetime
from models.study_session import SkillType




class StudySessionCreate(BaseModel):
    skill_type: SkillType
    started_at: datetime
    ended_at: datetime
    duration_minutes: int
    time_of_day_bucket: str


class StudySessionResponse(StudySessionCreate):
    id: int

    class Config:
        from_attributes = True
