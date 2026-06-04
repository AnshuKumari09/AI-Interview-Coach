from utils.llm import llm

def generate_questions(resume_text):

    prompt = f"""
    You are a senior technical interviewer.

    Based on the candidate's resume, generate exactly 10 interview questions.

    Return ONLY the questions.
    One question per line.

    Resume:
    {resume_text}
    """

    response = llm.invoke(prompt)

    questions = response.content.split("\n")

    questions = [
        q.strip()
        for q in questions
        if q.strip()
    ]

    return questions