from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime,
    String,
    Enum
)
from sqlalchemy.sql import func
from app.db.database import Base
import enum



class SkillType(str, enum.Enum):
    vocab = "vocab"
    grammar = "grammar"
    reading = "reading"
    listening = "listening"


class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    skill_type = Column(Enum(SkillType), nullable=False)

    started_at = Column(DateTime(timezone=True), nullable=False)
    ended_at = Column(DateTime(timezone=True), nullable=False)

    duration_minutes = Column(Integer, nullable=False)

    time_of_day_bucket = Column(
        String, nullable=False
    )  # morning / afternoon / evening / night

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True
    )

