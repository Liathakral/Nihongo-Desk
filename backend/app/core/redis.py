import os
import redis

REDIS_URL = os.getenv("REDIS_URL")

redis_conn = redis.from_url(
    REDIS_URL,
    decode_responses=True
)

def process_job(job_id):
    
    redis_conn.publish(f"job:{job_id}", "Starting job")

    for i in range(5):
        redis_conn.publish(f"job:{job_id}", f"Processing step {i}")
    
    redis_conn.publish(f"job:{job_id}", "Job finished")