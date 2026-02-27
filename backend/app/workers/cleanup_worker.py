from datetime import datetime
from db.database import SessionLocal
from models.insights import Insight

import logging
logger = logging.getLogger(__name__)

def cleanup_expired_insights():
    db = SessionLocal()
    try:
        
        expired = db.query(Insight).filter(
            Insight.valid_until != None,
            Insight.valid_until < datetime.utcnow(),
            Insight.is_active == True
        ).all()
        logger.info(f"Found {len(expired)} expired insights")

        for insight in expired:
            insight.is_active = False
        logger.info("Cleanup completed")
        db.commit()

    except Exception:
        logger.error("Cleanup job failed", exc_info=True)

    db.close()
