from sqlalchemy.orm import Session
from core.security import verify_password, create_access_token

from sqlalchemy.orm import Session
from services.users import get_user_by_email, create_user,create_refresh_token_for_user
from core.security import hash_password
from datetime import datetime, timedelta


def signup_user(db: Session, email: str, password: str):
    # 1. Check if user already exists
    user = get_user_by_email(db, email)
    if user:
        return None

    # 2. Hash the password
    hashed_password = hash_password(password)

    # 3. Create user in DB
    new_user = create_user(
        db=db,
        email=email,
        hashed_password=hashed_password
    )

    return new_user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    access_token=create_access_token({"sub": str(user.id)})
    refresh_token=create_refresh_token_for_user(db, user.id)

    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }

