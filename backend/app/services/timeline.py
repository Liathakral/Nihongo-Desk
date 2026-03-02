# from sqlalchemy.orm import Session
# from app.models.insights import Insight
# from app.models.next_action import NextAction

# def get_user_timeline(db:Session,user_id:int):
    
#     insights= db.query(Insight).filter(Insight.user_id==user_id).all()
    
#     next_actions = db.query(NextAction).filter(NextAction.user_id==user_id).all()
    
#     item=[]
#     for i in insights:
#         item.append({
#             "type":"insight",
#             "title":i.title,
#             "message":i.message,
#             "severity":i.severity,
#             "created_at":i.created_at
#         })
#     for n in next_actions:
#         item.append({
#             "type":"next_action",
#             "title": "Next Recommended Action",

#             "message":n.message,
#             "severity":None,
#             "created_at":n.created_at
#         })
        
#     # Sort by created_at
#     item.sort(key=lambda x: x["created_at"], reverse=True)
    
#     return item


from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.study_session import StudySession   
from app.models.performance import PerformanceLog
from app.models.insights import Insight
from app.models.next_action import NextAction


def get_user_timeline(db: Session, user_id: int):

   

    accuracy_data = (
        db.query(
            func.date(StudySession.started_at).label("date"),
            func.avg(PerformanceLog.perceived_performance ).label("avg_accuracy")
        )
        .join(PerformanceLog, PerformanceLog.session_id == StudySession.id)
        .filter(StudySession.user_id == user_id)
        .group_by(func.date(StudySession.started_at))
        .order_by(func.date(StudySession.started_at))
        .all()
    )

    accuracy_trend = [
        {
            "date": str(row.date),
           "accuracy": round(row.avg_accuracy * 100, 2)
        }
        for row in accuracy_data
    ]


    # ---------------------------
    # 2️⃣ Mistake Breakdown
    # ---------------------------

    mistake_data = (
        db.query(
            PerformanceLog.primary_struggle,
            func.count(PerformanceLog.id).label("count")
        )
        .join(StudySession, StudySession.id == PerformanceLog.session_id)
        .filter(StudySession.user_id == user_id)
        .group_by(PerformanceLog.primary_struggle)
        .all()
    )

    mistake_breakdown = [
        {
           "mistake_type": row.primary_struggle.value if row.primary_struggle else None,
            "count": row.count
        }
        for row in mistake_data
    ]


    # ---------------------------
    # 3️⃣ Total Sessions
    # ---------------------------

    total_sessions = (
        db.query(func.count(StudySession.id))
        .filter(StudySession.user_id == user_id)
        .scalar()
    )


    # ---------------------------
    # 4️⃣ Recent Insights (Optional)
    # ---------------------------

    recent_insights = (
        db.query(Insight)
        .filter(Insight.user_id == user_id)
        .order_by(Insight.created_at.desc())
        .limit(3)
        .all()
    )

    insights_data = [
        {
            "title": i.title,
            "message": i.message,
            "severity": i.severity
        }
        for i in recent_insights
    ]
    weakest_area = None

    if mistake_breakdown:
        weakest_area = max(mistake_breakdown, key=lambda x: x["count"])["mistake_type"]
     
    trend_direction = "stable"

    if len(accuracy_trend) >= 2:
        if accuracy_trend[-1]["accuracy"] > accuracy_trend[-2]["accuracy"]:
            trend_direction = "improving"
        elif accuracy_trend[-1]["accuracy"] < accuracy_trend[-2]["accuracy"]:
            trend_direction = "declining"

    # ---------------------------
    # Final Response
    # ---------------------------
    print("Timeline Analytics:", {
        "accuracy_trend": accuracy_trend,
        "mistake_breakdown": mistake_breakdown,         
        "total_sessions": total_sessions,
        "recent_insights": insights_data,
        "weakest_area": weakest_area,
        "trend_direction": trend_direction,
    })
   
    return {
        "accuracy_trend": accuracy_trend,
        "mistake_breakdown": mistake_breakdown,
        "total_sessions": total_sessions,
        "recent_insights": insights_data,
        "weakest_area": weakest_area,
        "trend_direction": trend_direction,
    }