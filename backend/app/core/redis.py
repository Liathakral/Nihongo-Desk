import os
import redis

REDIS_URL = os.getenv("REDIS_URL")

redis_conn = redis.from_url(
    REDIS_URL,
    decode_responses=True
)

