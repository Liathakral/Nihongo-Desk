import json
import asyncio
import redis.asyncio as aioredis
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.core.config import settings
from app.services.dependencies import get_current_user


router = APIRouter()


async def event_generator(user_id: int):
    """Subscribe to Redis pub/sub and yield SSE-formatted messages."""
    r = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    pubsub = r.pubsub()
    channel = f"plan_events:{user_id}"

    await pubsub.subscribe(channel)
    try:
        async for message in pubsub.listen():
            if message["type"] != "message":
                continue

            raw = message["data"]
            parsed = json.loads(raw)
            event_name = parsed.get("event", "message")
            data = json.dumps(parsed.get("data", {}))

            # SSE format: event + data lines, separated by double newline
            yield f"event: {event_name}\ndata: {data}\n\n"

            # Stop streaming after terminal events
            if event_name in ("completed", "error"):
                break

    finally:
        await pubsub.unsubscribe(channel)
        await r.aclose()


@router.get("/stream/plan-progress")
async def stream_plan_progress(user=Depends(get_current_user)):
    return StreamingResponse(
        event_generator(user.id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",   # disables nginx buffering
            "Connection": "keep-alive",
        },
    )