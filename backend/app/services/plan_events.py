import json

from app.core.redis import redis_conn

def publish_plan_event(user_id: int, event: str, data: dict):
    """Publish a plan generation event to a Redis channel."""
    channel = f"plan_events:{user_id}"
    payload = json.dumps({"event": event, "data": data})
    redis_conn.publish(channel, payload)