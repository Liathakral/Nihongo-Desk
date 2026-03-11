import json
import logging
from datetime import date

from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.services.daily_plan import save_daily_plan
from app.services.plan_events import publish_plan_event
import app.models
from app.services.nextday_planner import generate_daily_plan
from app.utils.velocity import get_effective_velocity

logger = logging.getLogger(__name__)

JLPT_REQUIREMENTS = {
    "N5": {"vocab": 800,  "kanji": 100,  "grammar": 80},
    "N4": {"vocab": 1500, "kanji": 300,  "grammar": 120},
    "N3": {"vocab": 3700, "kanji": 650,  "grammar": 200},
    "N2": {"vocab": 6000, "kanji": 1000, "grammar": 300},
    "N1": {"vocab": 10000,"kanji": 2000, "grammar": 400},
}


def generate_next_day_plan(user_id: int, plan_date: date):
    logger.info(f"Worker started for user={user_id} date={plan_date}")
    publish_plan_event(user_id, "started", {
        "message": "Plan generation started",
        "plan_date": str(plan_date),
    })

    db: Session = SessionLocal()
    try:
        # Stage 1 — velocity
        publish_plan_event(user_id, "progress", {
            "step": "velocity",
            "message": "Calculating study velocity...",
        })
        velocity = get_effective_velocity(db, user_id)
        publish_plan_event(user_id, "progress", {
            "step": "velocity",
            "message": "Velocity calculated",
            "velocity": velocity,
        })

        # Stage 2 — AI plan generation
        publish_plan_event(user_id, "progress", {
            "step": "ai_generation",
            "message": "Generating AI plan...",
        })
        plan = generate_daily_plan(db, user_id, velocity)
        publish_plan_event(user_id, "progress", {
            "step": "ai_generation",
            "message": "AI plan generated",
            "plan_preview": {k: plan[k] for k in list(plan)[:3]},  # partial preview
        })

        # Stage 3 — persist
        publish_plan_event(user_id, "progress", {
            "step": "saving",
            "message": "Saving plan to database...",
        })
        save_daily_plan(db, user_id, plan, plan_date)
        publish_plan_event(user_id, "completed", {
            "message": "Plan saved successfully",
            "plan_date": str(plan_date),
            "plan": plan,
        })

        logger.info(f"Plan generated for {plan_date} for user {user_id}")

    except Exception as e:
        logger.exception("Daily plan generation failed")
        publish_plan_event(user_id, "error", {
            "message": str(e),
            "step": "unknown",
        })

    finally:
        db.close()