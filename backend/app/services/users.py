from sqlalchemy.orm import Session
from models.users import User, RefreshToken
from core.security import create_refresh_token
from datetime import datetime, timedelta

def create_refresh_token_for_user(db, user_id: int):
    token = create_refresh_token()
    expires_at = datetime.utcnow() + timedelta(days=7)

    refresh_token = RefreshToken(
        user_id=user_id,
        token=token,
        expires_at=expires_at
    )

    db.add(refresh_token)
    db.commit()
    return token

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, email: str, hashed_password: str):
    user = User(
        email=email,
        hashed_password=hashed_password
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()
