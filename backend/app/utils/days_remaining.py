from datetime import datetime

def compute_days_until_exam(exam_date):

    today = datetime.utcnow().date()

    remaining_days = (exam_date.date() - today).days

    return max(remaining_days, 1)