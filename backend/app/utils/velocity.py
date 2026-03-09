

from app.services.learning_progress import compute_user_learning_velocity
DEFAULT_VELOCITY = {
    "vocab_per_day": 25,
    "kanji_per_day": 8,
    "grammar_per_day": 2
}

def get_effective_velocity(db, user_id):

    velocity = compute_user_learning_velocity(db, user_id)

    if velocity is None:
        return DEFAULT_VELOCITY

    return velocity