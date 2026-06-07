from utils.llm import llm

def generate_questions(resume_text, difficulty="Medium"):

    difficulty_instruction = {
        "Easy": "Ask basic conceptual questions suitable for freshers.",
        "Medium": "Ask intermediate questions involving projects and problem solving.",
        "Hard": "Ask advanced questions involving system design, optimization and deep technical knowledge."
    }

    prompt = f"""
    You are a senior technical interviewer.

    Difficulty Level: {difficulty}
    Instruction: {difficulty_instruction[difficulty]}

    Based on the candidate's resume, generate exactly 5 interview questions.

    Focus on:
    - Technical skills mentioned in resume
    - Projects the candidate has worked on
    - Tools and technologies used

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