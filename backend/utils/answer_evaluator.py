from utils.llm import llm

def evaluate_answer(question, answer):

    prompt = f"""
    You are a senior technical interviewer.

    Question:
    {question}

    Candidate Answer:
    {answer}

    Evaluate the answer.

    Give:

    Score out of 10

    Strengths

    Weaknesses

    Correct Answer
    """

    response = llm.invoke(prompt)

    return response.content