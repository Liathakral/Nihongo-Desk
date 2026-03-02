from sqlalchemy.orm import Session
from app.models.insights import Insight, InsightType
from app.models.next_action import NextAction
from datetime import datetime


def deactivate_old_actions(db: Session, user_id: int):
    db.query(NextAction).filter(
        NextAction.user_id == user_id,
        NextAction.is_active == True
    ).update({"is_active": False})


def generate_next_action(db: Session, user_id: int) -> NextAction:
    deactivate_old_actions(db, user_id)

    insights = (
        db.query(Insight)
        .filter(
            Insight.user_id == user_id,
            Insight.is_active == True
        )
        .order_by(Insight.severity.desc())
        .all()
    )

    # ---------------- Rule 1: Warning ----------------
    for i in insights:
        if i.insight_type == InsightType.warning:
            return _create_action(
                db,
                user_id,
                action_type="light_review",
                duration=15,
                difficulty=2,
                message="Short, low-pressure review session",
                reasoning={
                    "trigger": "warning",
                    "insight_id": i.id,
                    "why": "High effort with low return detected"
                }
            )

    # ---------------- Rule 2: Weakness ----------------
    for i in insights:
        if i.insight_type == InsightType.weakness:
            return _create_action(
                db,
                user_id,
                action_type="targeted_practice",
                duration=20,
                difficulty=3,
                message="Focused practice on your weakest area",
                reasoning={
                    "trigger": "weakness",
                    "insight_id": i.id,
                    "mistake_type": i.evidence.get("mistake_type")
                }
            )

    # ---------------- Rule 3: Pattern ----------------
    for i in insights:
        if i.insight_type == InsightType.pattern:
            return _create_action(
                db,
                user_id,
                action_type="timed_session",
                duration=20,
                difficulty=3,
                message="Study during your strongest time window",
                reasoning={
                    "trigger": "pattern",
                    "best_time": i.evidence.get("best_time")
                }
            )

    # ---------------- Rule 4: Progress ----------------
    for i in insights:
        if i.insight_type == InsightType.progress:
            return _create_action(
                db,
                user_id,
                action_type="reinforcement",
                duration=25,
                difficulty=4,
                message="Reinforce a skill that is improving",
                reasoning={
                    "trigger": "progress",
                    "insight_id": i.id
                }
            )

    # ---------------- Rule 5: Default ----------------
    return _create_action(
        db,
        user_id,
        action_type="balanced_review",
        duration=20,
        difficulty=3,
        message="Balanced review to maintain momentum",
        reasoning={"trigger": "default"}
    )


def _create_action(
    db: Session,
    user_id: int,
    action_type: str,
    duration: int,
    difficulty: int,
    message: str,
    reasoning: dict,
) -> NextAction:
    action = NextAction(
        user_id=user_id,
        action_type=action_type,
        duration_minutes=duration,
        difficulty_level=difficulty,
        message=message,
        reasoning=reasoning,
    )

    db.add(action)
    db.commit()
    db.refresh(action)

    return action
