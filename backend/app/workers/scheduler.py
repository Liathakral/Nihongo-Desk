from rq_scheduler import Scheduler
from datetime import datetime
from core.redis import redis_conn
from cleanup_worker import cleanup_expired_insights

def setup_scheduler():
    scheduler = Scheduler(connection=redis_conn)

    # Avoid duplicate schedules
    existing_jobs = scheduler.get_jobs()

    if not any(job.func_name.endswith("cleanup_expired_insights") for job in existing_jobs):
        scheduler.schedule(
            scheduled_time=datetime.utcnow(),
            func=cleanup_expired_insights,
            interval=86400,  # 24 hours
            repeat=None
        )
        print("Daily cleanup job scheduled.")
    else:
        print("Cleanup job already scheduled.")
