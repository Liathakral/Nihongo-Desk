import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.services.insights import generate_insights
import random
from datetime import datetime, timedelta
from app.core.security import hash_password

from app.db.database import SessionLocal
from app.models.study_session import StudySession
from app.models.performance import PerformanceLog
from app.models.insights import Insight
from app.models.next_action import NextAction
from app.models.users import User, RefreshToken
db = SessionLocal()

skill_types = ["vocab", "grammar", "reading", "listening"]

mistakes = [
    "particle",
    "vocabulary",
    "grammar_structure",
    "reading_inference",
    "listening_detail",
    "kanji",
    "time_pressure"
]

time_buckets = ["morning", "afternoon", "evening", "night"]


def clear_tables():
    print("Deleting existing rows...")

    db.query(RefreshToken).delete(synchronize_session=False)
    db.query(PerformanceLog).delete(synchronize_session=False)
    db.query(StudySession).delete(synchronize_session=False)
    db.query(Insight).delete(synchronize_session=False)
    db.query(NextAction).delete(synchronize_session=False)
    db.query(User).delete(synchronize_session=False)

    db.commit()

def create_dummy_user():

    db.query(User).filter(
        User.email == "liathakral28@gmail.com"
    ).delete()

    db.commit()

    user = User(
        email="liathakral28@gmail.com",
        hashed_password=hash_password("lia"),
        created_at=datetime.utcnow()
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user.id

def seed_sessions():
    user_id = create_dummy_user()
   
    print("Creating sessions...")

    base_time = datetime.utcnow() - timedelta(days=20)

    sessions = []

    for i in range(20):

        start = base_time + timedelta(days=i)
        duration = random.choice([20, 30, 45, 60])

        session = StudySession(
        user_id=user_id,
        skill_type=random.choice(skill_types),
        started_at=start,
        ended_at=start + timedelta(minutes=duration),
        duration_minutes=duration,
        time_of_day_bucket=random.choice(time_buckets)
    )
        db.add(session)
        db.flush()

        performance = PerformanceLog(
            session_id=session.id,
            perceived_performance=round(random.uniform(0.3, 1.0), 2),
            primary_struggle=random.choice(mistakes),
            focus_level=random.randint(2, 5),
            difficulty_level=random.randint(1, 5),
            confidence_rating=random.randint(2, 5),
            reflection_note="Study session reflection"
        )

        db.add(performance)

        sessions.append(session)
        


    db.commit()
    print("Generating insights...")

    generate_insights(db, user_id)

    print("Insights generated")

    print(f"Inserted {len(sessions)} sessions")



if __name__ == "__main__":
    clear_tables()
    seed_sessions()