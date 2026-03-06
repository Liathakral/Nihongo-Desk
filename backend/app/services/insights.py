from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.insights import Insight, InsightType
from app.models.performance import PerformanceLog
from app.models.study_session import StudySession
from sqlalchemy import func

from decimal import Decimal   
# ---------- helpers ----------

def deactivate_similar_insights(db, user_id, insight_type):
    db.query(Insight).filter(
        Insight.user_id == user_id,
        Insight.insight_type == insight_type,
        Insight.is_active == True
    ).update({"is_active": False})


# ---------- RULE 1: Weakness detection ----------

def detect_repeated_mistake(db: Session, user_id: int):
    rows = (
        db.query(
            PerformanceLog.primary_struggle,
            func.count().label("count")
        )
        .join(StudySession)
        .filter(StudySession.user_id == user_id)
        .group_by(PerformanceLog.primary_struggle)
        .having(func.count() >= 3)
        .all()
    )

    insights = []

    for mistake, count in rows:
        insights.append({
            "type": InsightType.weakness,
            "title": "Recurring mistake detected",
            "message": (
                "primary_struggle": mistake.value.replace("_", " ").title(),
                "occurrence": "repeated"              
            ),
            "severity": min(5, count),
            "evidence": {
              "mistake_type": mistake,

                "occurrences": count
            }
        })

    return insights


# ---------- RULE 2: False progress detector ----------

def detect_false_progress(db: Session, user_id: int):
    rows = (
        db.query(
            func.avg(PerformanceLog.perceived_performance),
            func.avg(PerformanceLog.confidence_rating)
        )
        .join(StudySession)
        .filter(StudySession.user_id == user_id)
        .all()
    )

    avg_performance, avg_confidence = rows[0]

    if avg_confidence and avg_performance and avg_confidence >= 4 and avg_performance < 0.6:
        return [{
            "type": InsightType.warning,
            "title": "False progress detected",
            "message": (
                "Confidence remains high, but accuracy has not improved. "
                "This often happens when recognition replaces recall."
            ),
            "severity": 4,
            "evidence": {
                "avg_performance": round(avg_performance, 2),
                "avg_confidence": round(avg_confidence, 1)

            }
        }]

    return []


# ---------- RULE 3: Time-of-day pattern ----------

def detect_time_pattern(db: Session, user_id: int):
    rows = (
        db.query(
            StudySession.time_of_day_bucket,
            func.avg(PerformanceLog.perceived_performance)
        )
        .join(PerformanceLog)
        .filter(StudySession.user_id == user_id)
        .group_by(StudySession.time_of_day_bucket)
        .all()
    )

    if len(rows) < 2:
        return []

    best = max(rows, key=lambda r: r[1])
    worst = min(rows, key=lambda r: r[1])

    if best[1] - worst[1] >= 0.15:
        return [{
            "type": InsightType.pattern,
            "title": "Time-of-day performance pattern",
            "message": (
                f"Your accuracy is significantly higher during "
                f"{best[0]} sessions compared to {worst[0]}."
            ),
            "severity": 3,
            "evidence": {
                "best_time": best[0],
                "worst_time": worst[0],
                "difference": round(best[1] - worst[1], 2)
            }
        }]

    return []

def make_json_safe(data: dict):
    safe = {}
    for k, v in data.items():
        if isinstance(v, Decimal):
            safe[k] = float(v)
        elif hasattr(v, "value"):  # Enum
            safe[k] = v.value
        else:
            safe[k] = v
    return safe

# ---------- MAIN ENTRY ----------

def generate_insights(db: Session, user_id: int):
    detected = []

    detected += detect_repeated_mistake(db, user_id)
    detected += detect_false_progress(db, user_id)
    detected += detect_time_pattern(db, user_id)

    for item in detected:
        deactivate_similar_insights(db, user_id, item["type"])

        insight = Insight(
            user_id=user_id,
            insight_type=item["type"],
            title=item["title"],
            message=item["message"],
            severity=item["severity"],
            evidence = make_json_safe(item["evidence"]),

            valid_until=datetime.utcnow() + timedelta(days=7),
        )
       
        db.add(insight)

    db.commit()
