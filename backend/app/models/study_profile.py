from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    String,
    Enum,
    Date,
    DateTime,
    
)
from sqlalchemy.sql import func
from app.db.database import Base
import enum

class JLPTLevel(str,enum.Enum):
    N5 = "N5"
    N4 = "N4"
    N3 = "N3"
    N2 = "N2"
    N1 = "N1"
    
    
    
class StudyProfile(Base):
    
    __tablename__ = "study_profiles"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True
    )
    
    jlpt_level = Column(Enum(JLPTLevel), nullable=False)

    target_exam_date = Column(Date)

    daily_study_minutes = Column(Integer)

    vocab_known = Column(Integer, default=0)
    kanji_known = Column(Integer, default=0)
    grammar_known = Column(Integer, default=0)

    created_at = Column(DateTime, server_default=func.now())
    
