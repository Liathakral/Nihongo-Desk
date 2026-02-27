from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from schemas.auth import LoginRequest, TokenResponse,SignupRequest
from services.auth import authenticate_user, signup_user
from db.database import SessionLocal

from services.dependencies import get_current_user
from models.users import User, RefreshToken
from fastapi import Cookie
from datetime import datetime
from core.security import create_access_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/refresh")
def refresh_token(
    refresh_token: str | None = Cookie(None),
    db: Session = Depends(get_db),
):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token")

    db_token = (
        db.query(RefreshToken)
        .filter(RefreshToken.token == refresh_token)
        .first()
    )

    if not db_token or db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Login again")

    new_access_token = create_access_token(
        {"sub": str(db_token.user_id)}
    )

    return {"access_token": new_access_token}


    



@router.post("/login")
def login(
    data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    token = authenticate_user(db, data.email, data.password)
    if not token:
        raise HTTPException(status_code=401)

    response.set_cookie(
        key="refresh_token",
        value=token["refresh_token"],
        httponly=True,
        secure=False,        # True only for HTTPS
        samesite="lax",
        path="/"
    )

    return {
        "access_token": token["access_token"]
    }


@router.post("/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    user = signup_user(db, data.email, data.password)

    if not user:
        raise HTTPException(status_code=400, detail="User already exists")

    return {"message": "User created successfully"}





@router.get("/me")
def read_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "created_at": current_user.created_at
    }


