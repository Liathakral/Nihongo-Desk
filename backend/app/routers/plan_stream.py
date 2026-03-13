from fastapi import APIRouter
from sse_starlette import EventSourceResponse
from core.redis import redis_conn
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