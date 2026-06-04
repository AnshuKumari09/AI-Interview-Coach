from utils.resume_analyzer import analyze_resume
from utils.question_generator import generate_questions


def create_mock_interview(resume_text):

    analysis = analyze_resume(resume_text)

    questions = generate_questions(resume_text)

    return {
        "analysis": analysis,
        "questions": questions
    }