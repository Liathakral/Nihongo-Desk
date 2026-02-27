from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from core.config import settings
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
import secrets

def create_refresh_token():
    return secrets.token_urlsafe(32)


def hash_password(password: str) -> str:
  
    return pwd_context.hash(password[:72])

def verify_password(password: str, hashed_password: str):
    return pwd_context.verify(password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
