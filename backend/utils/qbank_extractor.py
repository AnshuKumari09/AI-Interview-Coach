from utils.llm import llm
def extract_questions_from_bank(
    qbank_text,
    difficulty,
    resume_text,
    num_questions
):
    prompt = f"""
    You are a technical interviewer.

    Here is a question bank:
    {qbank_text}

    Candidate's resume:
    {resume_text}

    Difficulty: {difficulty}

    Select exactly {num_questions} questions from the question bank.

    IMPORTANT:
    - Return only questions.
    - Do not include answers.
    - Do not include explanations.
    - Do not include notes.

    Return ONLY the selected questions.
    One question per line.
    """

    response = llm.invoke(prompt)

    questions = [
        line.strip()
        for line in response.content.split("\n")
        if line.strip()
    ]

    return questions[:num_questions]