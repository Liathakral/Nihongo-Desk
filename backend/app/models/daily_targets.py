


from sqlalchemy import Column, Integer, Boolean, Date,DateTime, ForeignKey, Enum, CheckConstraint,Float, func
from backend.app.db.database import Base


class DailyPlan(Base):
    __tablename__ = "daily_plans"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE")
    )

    date = Column(Date)

    vocab_target = Column(Integer)
    kanji_target = Column(Integer)
    grammar_target = Column(Integer)

    reading_minutes = Column(Integer)
    listening_minutes = Column(Integer)

    created_at = Column(DateTime, server_default=func.now())
    
    
class PlanCompletion(Base):
    __tablename__ = "plan_completion"

    id = Column(Integer, primary_key=True)

    plan_id = Column(
        Integer,
        ForeignKey("daily_plans.id", ondelete="CASCADE"),
        nullable=False,
        unique=True
    )

    vocab_done = Column(Integer, default=0)
    kanji_done = Column(Integer, default=0)
    grammar_done = Column(Integer, default=0)

    reading_minutes_done = Column(Integer, default=0)
    listening_minutes_done = Column(Integer, default=0)

    completed = Column(Boolean, default=False)

    updated_at = Column(DateTime, server_default=func.now())