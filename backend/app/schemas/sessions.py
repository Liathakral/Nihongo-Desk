from pydantic import BaseModel
from datetime import datetime




class StudySessionCreate(BaseModel):
    started_at: datetime
    ended_at: datetime
    duration_minutes: int
    time_of_day_bucket: str


class StudySessionResponse(StudySessionCreate):
    id: int

    class Config:
        from_attributes = True
