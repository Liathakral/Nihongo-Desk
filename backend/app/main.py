from fastapi import FastAPI
from app.routers.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from app.models.users import Base
from app.routers.sessions import router as study_session_router
from app.routers.performance import router as performance_router
from app.routers.timeline import router as timeline_router
from app.routers.insights import router as insights_router
from app.routers.next_action import router as next_action_router
app = FastAPI()

from app.core.logging_config import setup_logging

setup_logging()

app.include_router(auth_router, prefix="/auth", tags=["auth"])

app.include_router(study_session_router, tags=["study_sessions"])
app.include_router(performance_router, tags=["performance"])
app.include_router(timeline_router, tags=["timeline"])
app.include_router(insights_router, tags=["insights"])
app.include_router(next_action_router, tags=["next_actions"])




app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,                  
    allow_methods=["*"],
    allow_headers=["*"],
)