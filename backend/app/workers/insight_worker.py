from sqlalchemy.orm import Session
from db.database import SessionLocal
from core.queue import insight_queue
from services.next_action import generate_next_action
from services.insights import generate_insights
import logging

logger = logging.getLogger(__name__)

from models.users import User
from models.study_session import StudySession
from models.performance import PerformanceLog
from models.insights import Insight
from models.next_action import NextAction

def analyze_user_learning(user_id: int):
    db: Session = SessionLocal()
    try:
        # Generate next action for the user
        logger.info(f"Starting analysis for user {user_id}")
        generate_insights(db, user_id)
        generate_next_action(db, user_id)
        logger.info(f"Completed analysis for user {user_id}")
    except Exception as e:
        logger.error(
            f"Insight generation failed for user {user_id}",
            exc_info=True
        )

        # Here you can save the next action to the database or perform other operations
    finally:
        db.close()
        