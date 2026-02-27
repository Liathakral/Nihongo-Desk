from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    String,
    Enum,
    DateTime,
    Boolean,
    JSON
)
from sqlalchemy.sql import func
from db.database import Base
import enum


class InsightType(str, enum.Enum):
    pattern = "pattern"
    weakness = "weakness"
    progress = "progress"
    warning = "warning"
    recommendation = "recommendation"


class Insight(Base):
    __tablename__ = "insights"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    insight_type = Column(Enum(InsightType), nullable=False)

    title = Column(String, nullable=False)
    message = Column(String, nullable=False)

    evidence = Column(JSON, nullable=False)

    severity = Column(Integer, nullable=False)  # 1–5

    is_active = Column(Boolean, default=True)

    valid_until = Column(DateTime(timezone=True), nullable=True,index=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now(),
        index=True
    )
