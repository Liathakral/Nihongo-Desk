from fastapi import APIRouter
from sse_starlette import EventSourceResponse
from app.core.redis import redis_conn
import asyncio

router = APIRouter()

r = redis_conn

@router.get("/logs/{job_id}")
async def stream_logs(job_id: str):

    pubsub = r.pubsub()
    pubsub.subscribe(f"job:{job_id}")

    async def event_generator():
        while True:
            message = pubsub.get_message(ignore_subscribe_messages=True)

            if message:
                yield {
                    "event": "log",
                    "data": message["data"]
                }

            await asyncio.sleep(0.1)

    return EventSourceResponse(event_generator())

@router.get("/logs/{job_id}/history")
def get_logs(job_id: str):

    logs = redis_conn.lrange(f"job:{job_id}:logs", 0, -1)

    return {"logs": logs}