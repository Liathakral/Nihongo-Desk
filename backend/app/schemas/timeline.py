from pydantic import BaseModel
from typing import List, Optional


class AccuracyPoint(BaseModel):
    date: str
    accuracy: float


class MistakeBreakdownItem(BaseModel):
    mistake_type: str
    count: int


class InsightPreview(BaseModel):
    title: str
    message: str
    severity: int


class TimelineAnalytics(BaseModel):
    accuracy_trend: List[AccuracyPoint]
    mistake_breakdown: List[MistakeBreakdownItem]
    total_sessions: int
    recent_insights: List[InsightPreview]
    weakest_area: Optional[str]
    trend_direction: str