from utils.llm import llm
import uuid

def generate_questions(resume_text, difficulty="Medium"):

    difficulty_instruction = {
        "Easy": "Ask basic conceptual questions suitable for freshers.",
        "Medium": "Ask intermediate questions involving projects and problem solving.",
        "Hard": "Ask advanced questions involving system design, optimization and deep technical knowledge."
    }

    random_seed = str(uuid.uuid4())[:8]  # ✅ har baar alag

    prompt = f"""
    You are a senior technical interviewer. Session ID: {random_seed}

    Difficulty Level: {difficulty}
    Instruction: {difficulty_instruction[difficulty]}

    Based on the candidate's resume, generate exactly 5 UNIQUE interview questions.
    Every time you are called, generate DIFFERENT questions than before.
    Do not repeat the same questions across sessions.

    Focus on:
    - Technical skills mentioned in resume
    - Projects the candidate has worked on
    - Tools and technologies used
    - Vary question types: some conceptual, some project-based, some scenario-based

    Return ONLY the questions, numbered 1 to 5.
    One question per line.
    Do not add any extra text or explanation.

    Resume:
    {resume_text}
    """

    response = llm.invoke(prompt)

    questions = response.content.split("\n")

    questions = [
        q.strip()
        for q in questions
        if q.strip() and q.strip()[0].isdigit()
    ]

    return questions