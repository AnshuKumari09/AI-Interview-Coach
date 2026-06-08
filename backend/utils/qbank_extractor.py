from utils.llm import llm

def extract_questions_from_bank(qbank_text, difficulty, resume_text):
    prompt = f"""
    You are a technical interviewer.
    
    Here is a question bank:
    {qbank_text}
    
    Candidate's resume:
    {resume_text}
    
    Difficulty: {difficulty}
    
    Select 5 most relevant questions from the question bank 
    that match the candidate's background.
    
    Return ONLY the questions, numbered 1 to 5.
    One per line.
    """
    response = llm.invoke(prompt)
    questions = [
        q.strip()
        for q in response.content.split("\n")
        if q.strip() and q.strip()[0].isdigit()
    ]
    return questions