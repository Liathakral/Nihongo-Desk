import json
import logging
from datetime import date

from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.services.learning_progress import compute_user_learning_velocity
from app.services.daily_plan import save_daily_plan
from app.services.plan_completion import get_last_plan_completion
from app.services.study_profile import get_study_profile

from app.core.openai_client import client
from app.services.nextday_planner import generate_daily_plan

logger = logging.getLogger(__name__)


JLPT_REQUIREMENTS = {
    "N5": {"vocab": 800, "kanji": 100, "grammar": 80},
    "N4": {"vocab": 1500, "kanji": 300, "grammar": 120},
    "N3": {"vocab": 3700, "kanji": 650, "grammar": 200},
    "N2": {"vocab": 6000, "kanji": 1000, "grammar": 300},
    "N1": {"vocab": 10000, "kanji": 2000, "grammar": 400},
}


def generate_next_day_plan(user_id: int):

    db: Session = SessionLocal()

    try:

        velocity = compute_user_learning_velocity(db, user_id)

        plan = generate_daily_plan(db, user_id, velocity)

        save_daily_plan(db, user_id, plan)

        logger.info(f"Next plan generated for user {user_id}: {plan}")

    except Exception:
        logger.exception("Daily plan generation failed")

    finally:
        db.close()

