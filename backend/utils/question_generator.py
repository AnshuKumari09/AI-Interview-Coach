from utils.llm import llm

def generate_questions(resume_text):

    prompt = f"""
    You are a senior technical interviewer.

    Based on the candidate's resume, generate exactly 5 interview questions.
    Focus on:
    - Technical skills mentioned in resume
    - Projects the candidate has worked on
    - Tools and technologies used

    first ask easy questions then medium . 

    Return ONLY the questions.
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
        if q.strip()
    ]

    return questions