import json
import logging
from datetime import date

from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.services.daily_plan import save_daily_plan

import app.models
from app.core.openai_client import client
from app.services.nextday_planner import generate_daily_plan
from app.utils.velocity import get_effective_velocity

logger = logging.getLogger(__name__)


JLPT_REQUIREMENTS = {
    "N5": {"vocab": 800, "kanji": 100, "grammar": 80},
    "N4": {"vocab": 1500, "kanji": 300, "grammar": 120},
    "N3": {"vocab": 3700, "kanji": 650, "grammar": 200},
    "N2": {"vocab": 6000, "kanji": 1000, "grammar": 300},
    "N1": {"vocab": 10000, "kanji": 2000, "grammar": 400},
}

def generate_next_day_plan(user_id: int, plan_date: date):

    print("WORKER STARTED")
    print("USER:", user_id)
    print("PLAN DATE:", plan_date)

    db: Session = SessionLocal()

    try:
        velocity = get_effective_velocity(db, user_id)
        print("VELOCITY:", velocity)

        plan = generate_daily_plan(db, user_id, velocity)
        print("AI GENERATED PLAN:", plan)

        save_daily_plan(db, user_id, plan, plan_date)

        print("PLAN SAVED SUCCESSFULLY")

        logger.info(f"Plan generated for {plan_date} for user {user_id}")

    except Exception as e:
        print("WORKER ERROR:", e)
        logger.exception("Daily plan generation failed")

    finally:
        db.close()