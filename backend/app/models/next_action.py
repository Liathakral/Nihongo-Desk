from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    String,
    DateTime,
    JSON,
    Boolean
)
from sqlalchemy.sql import func
from app.db.database import Base


class NextAction(Base):
    __tablename__ = "next_actions"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    action_type = Column(String, nullable=False)

    duration_minutes = Column(Integer, nullable=False)

    difficulty_level = Column(Integer, nullable=False)

    message = Column(String, nullable=False)

    reasoning = Column(JSON, nullable=False)

    is_active = Column(Boolean, default=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True
    )
