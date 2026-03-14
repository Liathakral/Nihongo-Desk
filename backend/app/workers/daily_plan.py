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
import json
from datetime import datetime

# app/utils/logger.py

import json
from datetime import datetime
from app.core.redis import redis_conn

def publish_log(job_id: str, message: str, level: str = "INFO", progress: int | None = None):

    payload = {
        "timestamp": datetime.utcnow().isoformat(),
        "level": level,
        "message": message,
        "progress": progress
    }

    log = json.dumps(payload)

    redis_conn.rpush(f"job:{job_id}:logs", log)
    redis_conn.ltrim(f"job:{job_id}:logs", -100, -1)

    redis_conn.publish(f"job:{job_id}", log)

    # store active job for reload recovery
    redis_conn.set("active_job", job_id)
    
def generate_next_day_plan(user_id: int, plan_date: date, job_id: str):

    db: Session = SessionLocal()
    try:
        
        publish_log(job_id, "Starting plan generation", "INFO", 10)
        velocity = get_effective_velocity(db, user_id)

        publish_log(job_id, "Velocity calculated", "INFO", 40)
        plan = generate_daily_plan(db, user_id, velocity)

        publish_log(job_id, "Daily plan generated", "INFO", 70)
        save_daily_plan(db, user_id, plan, plan_date)

        publish_log(job_id, "Plan saved", "SUCCESS", 100)
        publish_log(job_id, "Job finished")

        publish_log(job_id, "Job finished", "SUCCESS", 100)





    except Exception as e:
        redis_conn.publish(f"job:{job_id}", f"Error: {str(e)}")

    finally:
        db.close()