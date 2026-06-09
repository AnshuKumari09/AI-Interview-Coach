import uuid
from utils.llm import llm

def should_ask_followup(score, answer):
    # "I don't know" type answers skip karo
    skip_phrases = [
        "i don't know", "i dont know",
        "no idea", "not sure", "i have no idea",
        "i am not sure", "don't know",
        "i don't have", "no knowledge",
        "i'm not sure", "im not sure"
    ]
    answer_lower = answer.lower().strip()

    for phrase in skip_phrases:
        if phrase in answer_lower:
            return False

    # Sirf score 4-7 pe followup
    return 4 <= score <= 7


def generate_followup(question, answer):
    seed = str(uuid.uuid4())[:8]
    prompt = f"""
    You are a strict technical interviewer. Session: {seed}

    You just asked:
    {question}

    Candidate answered:
    {answer}

    The answer was partially correct but incomplete.
    Ask ONE sharp follow-up question to test deeper understanding.

    Rules:
    - Pick a specific point from their answer and dig deeper
    - OR ask WHY or HOW something works
    - OR ask about an edge case or limitation
    - Do NOT repeat the original question
    - Max 1 question, 1-2 lines only
    - Sound like a real interviewer

    Return ONLY the follow-up question. Nothing else.
    """
    response = llm.invoke(prompt)
    return response.content.strip()