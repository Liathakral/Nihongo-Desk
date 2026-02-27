from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base,Session
from dotenv import load_dotenv
import os
from contextlib import contextmanager
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://nihongo_user:Nihongo123!@localhost:5432/nihongo_db")

engine = create_engine(DATABASE_URL)


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()
