import uuid
import random
from utils.llm import llm

def extract_questions_from_bank(qbank_text, difficulty, resume_text, num_questions=5):
    seed = str(uuid.uuid4())[:8]
    prompt = f"""
    You are a technical interviewer. Session: {seed}

    Here is a question bank:
    {qbank_text}

    Candidate resume summary:
    {resume_text[:500]}

    Difficulty: {difficulty}

    Select {num_questions} questions from the question bank.
    Every time you are called, select DIFFERENT questions in DIFFERENT ORDER.
    Do NOT always pick the same questions.

    Return ONLY the questions, numbered 1 to {num_questions}.
    One per line. No extra text.
    """
    response = llm.invoke(prompt)
    questions = [
        q.strip()
        for q in response.content.split("\n")
        if q.strip() and q.strip()[0].isdigit()
    ]
    
    # ✅ Extra randomization
    random.shuffle(questions)
    
    return questions