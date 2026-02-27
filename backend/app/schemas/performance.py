from pydantic import BaseModel
from datetime import datetime
from models.performance import MistakeType
from pydantic import  Field


class PerformanceLogCreate(BaseModel):
    session_id: int

    perceived_performance: float = Field(..., ge=0, le=1)

    primary_struggle: MistakeType

    focus_level: int = Field(..., ge=1, le=5)

    difficulty_level: int = Field(..., ge=1, le=5)

    confidence_rating: int | None = Field(None, ge=1, le=5)

    reflection_note: str | None = None





class PerformanceLogResponse(PerformanceLogCreate):
    id: int

    class Config:
        from_attributes = True
