from fastapi import APIRouter
from pydantic import BaseModel
from openai import OpenAI

from dotenv import load_dotenv
import os
router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class TutorRequest(BaseModel):
    question: str
    
@router.post("/ai/tutor")
def japanese_tutor(data: TutorRequest):

    system_prompt = """
    You are an AI Japanese tutor.

    Help students learn Japanese reading, grammar, kanji and vocabulary.

    You can:
    - explain grammar
    - explain kanji
    - explain vocabulary
    - explain sentences
    - translate Japanese to English
    - break down sentence structure

    Do NOT provide listening exercises.

    Always explain simply for JLPT N5–N3 learners.

    Response format:

    Explanation
    Examples
    Translation (if needed)
    """
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": data.question}
        ]
    )

    return {"answer": response.choices[0].message.content}
