from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.dependencies import get_current_user
from app.schemas.sessions import StudySessionCreate, StudySessionResponse
from app.services.session_service import create_study_session



router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("/", response_model=StudySessionResponse)
def create_session(
    data: StudySessionCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return create_study_session(db, user.id, data)
   
    
