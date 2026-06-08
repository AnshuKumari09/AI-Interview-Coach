from utils.llm import llm
def generate_acknowledgement(question, answer):
    prompt = f"""
    You are a conversational AI interviewer.
    
    Question asked: {question}
    Candidate answered: {answer}
    
    Write 1 sentence only:
    - Pick ONE specific technical point from their answer
    - Acknowledge it naturally
    - DO NOT start with "You mentioned"
    
    Examples:
    "Good point about using mode for categorical imputation."
    "K-means for customer segmentation is the right approach."
    "Using StandardScaler before training is correct."
    
    Max 15 words. Be specific. Vary your opening words.
    """
    response = llm.invoke(prompt)
    return response.content