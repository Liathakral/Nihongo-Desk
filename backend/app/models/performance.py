
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, CheckConstraint,Float

from sqlalchemy.sql import func
from app.db.database import Base
from app.models.study_session import SkillType
import enum


class MistakeType(str, enum.Enum):
    particle = "particle"
    vocabulary = "vocabulary"
    grammar_structure = "grammar_structure"
    reading_inference = "reading_inference"
    listening_detail = "listening_detail"
    kanji = "kanji"
    time_pressure = "time_pressure"
   
    
    
class PerformanceLog(Base):
    __tablename__ = "performance_logs"
    __table_args__ = (
        CheckConstraint("perceived_performance >= 0 AND perceived_performance <= 1", name="check_performance_range"),
        CheckConstraint("focus_level >= 1 AND focus_level <= 5", name="check_focus_range"),
        CheckConstraint("difficulty_level >= 1 AND difficulty_level <= 5", name="check_difficulty_range"),
    )

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("study_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    perceived_performance = Column(Float, nullable=False)

    primary_struggle = Column(
        Enum(MistakeType),
        nullable=False,
        index=True
    )

    focus_level = Column(Integer, nullable=False)

    difficulty_level = Column(Integer, nullable=False)

    confidence_rating = Column(Integer, nullable=True)

    reflection_note = Column(String, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
