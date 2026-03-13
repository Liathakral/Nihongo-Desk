import json
import logging
from datetime import date, datetime

from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.services.daily_plan import save_daily_plan
from app.core.redis import redis_conn
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
def publish_log(job_id: str, message: str):

    key = f"job:{job_id}:logs"

    log_line = f"[{datetime.utcnow().isoformat()}] {message}"

    # store log
    redis_conn.rpush(key, log_line)

    # keep last 100 logs
    redis_conn.ltrim(key, -100, -1)

    # realtime stream
    redis_conn.publish(f"job:{job_id}", log_line)
    
def generate_next_day_plan(user_id: int, plan_date: date, job_id: str):

    db: Session = SessionLocal()
    try:
        
        publish_log(job_id, "Starting plan generation")

        velocity = get_effective_velocity(db, user_id)
        publish_log(job_id, "Velocity calculated")

        plan = generate_daily_plan(db, user_id, velocity)
        publish_log(job_id, "Daily plan generated")

        save_daily_plan(db, user_id, plan, plan_date)
        publish_log(job_id, "Plan saved")

        publish_log(job_id, "Job finished")

    except Exception as e:
        redis_conn.publish(f"job:{job_id}", f"Error: {str(e)}")

    finally:
        db.close()