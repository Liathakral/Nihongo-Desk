from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from services.dependencies import get_current_user
from services.next_action  import generate_next_action
from models.next_action import NextAction

router = APIRouter(prefix="/next-action", tags=["next-action"])


@router.get("/")
def get_next_action(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    action = (
        db.query(NextAction)
        .filter(
            NextAction.user_id == user.id,
            NextAction.is_active == True
        )
        .order_by(NextAction.created_at.desc())
        .first()
    )

    if not action:
        action = generate_next_action(db, user.id)

    return action
