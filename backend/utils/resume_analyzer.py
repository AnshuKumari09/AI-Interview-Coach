from utils.llm import llm

def analyze_resume(resume_text):

    prompt = f"""
    Analyze the following resume.

    Return:
    1. Skills
    2. Projects
    3. Education

    Resume:
    {resume_text}
    """

    response = llm.invoke(prompt)

    return response.content