from pydantic import BaseModel
from datetime import date
from typing import Optional


class DailyPlanResponse(BaseModel):
    id: int
    date: date

    vocab_target: int
    kanji_target: int
    grammar_target: int

    reading_minutes: int
    listening_minutes: int

    class Config:
        from_attributes = True
        


class PlanCompletionUpdate(BaseModel):

    vocab_done: Optional[int] = None
    kanji_done: Optional[int] = None
    grammar_done: Optional[int] = None

    reading_minutes_done: Optional[int] = None
    listening_minutes_done: Optional[int] = None

    completed: Optional[bool] = None
    
    
class PlanCompletionResponse(BaseModel):

    id: int
    plan_id: int

    vocab_done: int
    kanji_done: int
    grammar_done: int

    reading_minutes_done: int
    listening_minutes_done: int
    job_id: str | None = None 


    completed: bool

    class Config:
        from_attributes = True