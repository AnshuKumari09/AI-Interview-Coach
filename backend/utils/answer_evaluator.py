from utils.llm import llm

def evaluate_answer(question, answer):

    prompt = f"""
    You are a strict technical interviewer. Evaluate the candidate's answer.

    Question: {question}
    Candidate's Answer: {answer}

    Respond in this EXACT format and nothing else:

    Score: X/10

    ✅ Strengths:
    - <only technical strengths, max 2 points>

    ❌ Weaknesses:
    - <only technical gaps, max 2 points>

    💡 Correct Answer:
    <technically accurate answer, max 5 lines>

    Rules:
    - Write Score ONLY once at the top
    - Do NOT repeat score at the end
    - Only evaluate technical content
    - Do NOT comment on communication style, confidence, or language
    - Do NOT use phrases like "the candidate said" or "the candidate seemed"
    - If candidate says "I don't know", weaknesses should say what the correct concept is, not that they lack knowledge
    - Be direct and technical only
    """

    response = llm.invoke(prompt)
    return response.content