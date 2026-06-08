from utils.llm import llm
def evaluate_answer(question, answer):

    prompt = f"""
    You are a strict technical interviewer. Evaluate the candidate's answer.

    Question: {question}
    Candidate's Answer: {answer}

    Respond in this exact format:

    Score: X/10

    ✅ Strengths:
    - <only technical strengths, max 2 points>

    ❌ Weaknesses:
    - <only technical gaps, max 2 points>

    💡 Correct Answer:
    <technically accurate answer, max 5 lines, no examples unless necessary>

    Rules:
    - Only evaluate technical content
    - Do NOT comment on communication style, confidence, or language
    - Do NOT use phrases like "the candidate said" or "the candidate seemed"
    - Be direct and technical only
    """

    response = llm.invoke(prompt)
    return response.content