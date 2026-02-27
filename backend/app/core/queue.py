from rq import Queue
from core.redis import redis_conn

insight_queue = Queue(
    "insight-analysis",
    connection=redis_conn
)
