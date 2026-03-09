
from app.models.daily_targets import DailyPlan, PlanCompletion


def compute_user_learning_velocity(db, user_id):

    sessions = (
        db.query(PlanCompletion)
        .join(DailyPlan)
        .filter(DailyPlan.user_id == user_id)
        .all()
    )

    total_vocab = sum(s.vocab_done for s in sessions)
    total_kanji = sum(s.kanji_done for s in sessions)
    total_grammar = sum(s.grammar_done for s in sessions)

    days = len(sessions)

    if days == 0:
        return None

    velocity = {
        "vocab_per_day": total_vocab / days,
        "kanji_per_day": total_kanji / days,
        "grammar_per_day": total_grammar / days
    }

    return velocity