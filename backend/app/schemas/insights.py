from pydantic import BaseModel
from datetime import datetime
from app.models.insights import InsightType


class InsightResponse(BaseModel):
    id: int
    insight_type: InsightType
    title: str
    message: str
    severity: int
    evidence: dict
    is_active: bool
    valid_until: datetime | None

    class Config:
        from_attributes = True
