from fastapi import FastAPI, UploadFile, File 
import uuid
from utils.question_generator import generate_questions
from utils.pdf_parser import extract_pdf_text
from utils.docx_parser import extract_docx_text
from utils.cleaner import clean_text
from utils.resume_analyzer import analyze_resume
from utils.answer_evaluator import evaluate_answer
from sessions.interview_store import interview_sessions
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import SessionLocal
# from database.models import User
from auth.dependencies import get_current_user
from auth.hashing import hash_password, verify_password
from auth.jwt_handler import create_access_token
from utils.rag.retriever import retrieve_context
from utils.tts import text_to_speech
from utils.qbank_extractor import extract_questions_from_bank
import os
import shutil
from utils.whisper_transcriber import transcribe_audio
from utils.rag.chunker import chunk_text
from utils.rag.embedder import get_embedding
from utils.rag.vector_db import add_chunks
from database.models import (
    User,
    InterviewSession,
    InterviewQuestion
)
from datetime import datetime
from sqlalchemy import desc
from utils.acknowledgement import generate_acknowledgement

app = FastAPI()
from pydantic import BaseModel
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ResumeRequest(BaseModel):
    resume_text: str

class QuestionRequest(BaseModel):
    resume_text: str

class AnswerRequest(BaseModel):
    question: str
    answer: str

class InterviewAnswerRequest(BaseModel):
    session_id: str
    db_session_id: int
    answer: str


@app.get("/")
def home():
    return {"message": "AI Interview Coach API Working"}


@app.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.post("/analyze-resume")
def analyze_resume_api(request: ResumeRequest):

    result = analyze_resume(request.resume_text)

    return {
        "analysis": result
    }

@app.post("/generate-questions")
def generate_questions_api(
    request: QuestionRequest,
    user: str = Depends(get_current_user)
):

    context = retrieve_context(
        "Generate interview questions from candidate projects and skills"
    )

    questions = generate_questions(
        "\n".join(context)
    )

    return {
        "questions": questions,
        "context_used": context,
        "requested_by": user
    }
@app.post("/evaluate-answer")
def evaluate_answer_api(request: AnswerRequest):

    result = evaluate_answer(
        request.question,
        request.answer
    )
    

    return {
        "evaluation": result
    }

@app.post("/submit-answer")
def submit_answer(
    request: InterviewAnswerRequest,
    user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    print("\n========== SUBMIT ==========")
    print("SESSION:", request.session_id)
    print("DB SESSION:", request.db_session_id)
    print("ANSWER:", request.answer)
    print("============================\n")

    session = interview_sessions.get(request.session_id)

    
    if not session:
        return {"error": "Invalid session"}

    current_index = session["current_question"]
    questions = session["questions"]

    current_question = questions[current_index]

    evaluation = evaluate_answer(
        current_question,
        request.answer
    )

    score = 0

    try:
        if "Score:" in evaluation:
            score_text = (
                evaluation
                .split("Score:")[1]
                .split("/")[0] 
                .strip()
            )
            score = round(float(score_text))

    except Exception:
        score = 0

    # Save question record
    question_row = InterviewQuestion(
        session_id=request.db_session_id,
        question=current_question,
        user_answer=request.answer,
        evaluation=evaluation,
        score=score
    )

    db.add(question_row)
    db.commit()

    session["scores"].append(evaluation)

    # Move to next question
    session["current_question"] += 1

    # Interview completed
    if session["current_question"] >= len(questions):

        db_session = (
            db.query(InterviewSession)
            .filter(
                InterviewSession.id == request.db_session_id
            )
            .first()
        )

        avg_score = 0

        if db_session:

            all_questions = (
                db.query(InterviewQuestion)
                .filter(
                    InterviewQuestion.session_id
                    == request.db_session_id
                )
                .all()
            )

            if len(all_questions) > 0:
                avg_score = round(
                    sum(q.score for q in all_questions)
                    / len(all_questions),
                    2
                )

            db_session.completed_at = datetime.utcnow()
            db_session.score = avg_score

            db.commit()
        acknowledgement = generate_acknowledgement(
            current_question,
            request.answer
        )

        return {
            "message": "Interview Completed",
            "total_questions": len(questions),
            "average_score": avg_score,
            "evaluations": session["scores"],
            "acknowledgement": acknowledgement,
            "summary": {
            "total_questions": len(questions),
            "average_score": avg_score,
            "feedback": "Great effort! Keep practicing technical explanations and project discussions."
            }
        }

    # Next question
    next_question = questions[
        session["current_question"]
    ]
    acknowledgement = generate_acknowledgement(
        current_question,
        request.answer
    )
    return {
        "evaluation": evaluation,
        "acknowledgement": acknowledgement,
        "next_question": next_question
    }


@app.post("/start-interview-qbank")
async def start_interview_qbank(
    resume: UploadFile = File(...),
    qbank: UploadFile = File(...),
    difficulty: str = "Medium",
    user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Resume read karo
    resume_content = await resume.read()
    resume_filename = f"{str(uuid.uuid4())[:8]}_{resume.filename}"
    resume_path = f"uploads/{resume_filename}"
    with open(resume_path, "wb") as f:
        f.write(resume_content)
    resume_text = extract_pdf_text(resume_path)
    resume_text = clean_text(resume_text)

    # Question bank read karo
    qbank_content = await qbank.read()
    qbank_filename = f"{str(uuid.uuid4())[:8]}_{qbank.filename}"
    qbank_path = f"uploads/{qbank_filename}"
    with open(qbank_path, "wb") as f:
        f.write(qbank_content)

    # PDF ya TXT
    if qbank.filename.endswith(".pdf"):
        qbank_text = extract_pdf_text(qbank_path)
    else:
        qbank_text = qbank_content.decode("utf-8")

    qbank_text = clean_text(qbank_text)

    # Questions extract karo qbank se
    
    questions = extract_questions_from_bank(qbank_text, difficulty, resume_text)

    db_user = db.query(User).filter(User.email == user).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_session = InterviewSession(user_id=db_user.id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)

    session_id = str(uuid.uuid4())
    interview_sessions[session_id] = {
        "questions": questions,
        "current_question": 0,
        "scores": [],
        "user": user
    }

    intro = """
Hello! I am your AI Interviewer.
I will ask you questions from your uploaded question bank.
Answer clearly and confidently. Let's begin.
"""

    return {
        "session_id": session_id,
        "db_session_id": db_session.id,
        "intro": intro,
        "first_question": questions[0],
        "total_questions": len(questions)
    }


@app.post("/start-interview")
async def start_interview(
    file: UploadFile = File(...),
    difficulty: str = "Medium",
    user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    extension = file.filename.split(".")[-1].lower()

    if extension != "pdf":
        return {"error": "Only PDF supported"}

    unique_filename = (
        f"{str(uuid.uuid4())[:8]}_{file.filename}"
    )

    path = f"uploads/{unique_filename}"

    content = await file.read()

    with open(path, "wb") as f:
        f.write(content)

    resume_text = extract_pdf_text(path)
    resume_text = clean_text(resume_text)

    analysis = analyze_resume(resume_text)

    questions = generate_questions(
        resume_text,difficulty
    )
    db_user = (
    db.query(User)
    .filter(User.email == user)
    .first()
    )
    if not db_user:
        raise HTTPException(
        status_code=404,
        detail="User not found"
        )
   

    db_session = InterviewSession(
        user_id=db_user.id
    )
        

    db.add(db_session)
    db.commit()
    db.refresh(db_session)

    session_id = str(uuid.uuid4())

    interview_sessions[session_id] = {
        "questions": questions,
        "current_question": 0,
        "scores": [],
        "analysis": analysis,
        "user": user
    }
    intro = """
Hello!

I am your AI Interviewer.

I will ask you a series of technical questions
based on your resume.

Try to answer clearly and confidently.

Let's begin.
"""

    return {
        "session_id": session_id,
        "db_session_id": db_session.id,
        "analysis": analysis,
        "intro": intro,
        "first_question": questions[0],
        "total_questions": len(questions)
    }

@app.post("/signup")
def signup(email: str, password: str, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == email).first()

    if user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        email=email,
        password=hash_password(password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}


@app.post("/transcribe-audio")
async def transcribe_audio_api(file: UploadFile = File(...)):

    file_name = f"{uuid.uuid4()}_{file.filename}"

    with open(file_name, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = transcribe_audio(file_name)

    return {
        "transcription": text
    }




class SpeakRequest(BaseModel):
    text: str


@app.post("/ai-speak")
def ai_speak(request: SpeakRequest):

    print("QUESTION RECEIVED:", request.text)

    text_to_speech(request.text)

    return {
        "message": "AI spoke"
    }

@app.get("/test-rag")
def test_rag():

    docs = retrieve_context(
        "What projects are mentioned in resume?"
    )

    return {
        "retrieved_docs": docs
    }

@app.get("/my-interviews")
def my_interviews(
    user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = (
        db.query(User)
        .filter(User.email == user)
        .first()
    )

    interviews = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.user_id == db_user.id
        )
        .order_by(desc(InterviewSession.id))
        .all()
    )

    result = []

    for interview in interviews:
        question_count = (
            db.query(InterviewQuestion)
            .filter(
                InterviewQuestion.session_id == interview.id
            )
            .count()
        )

        result.append({
            "session_id": interview.id,
            "score": interview.score,
            "completed_at": interview.completed_at,
            "total_questions": question_count
        })

    return result


@app.get("/interview-summary/{db_session_id}")
def interview_summary(
    db_session_id: int,
    user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    interview = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == db_session_id)
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    questions = (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.session_id == db_session_id
        )
        .all()
    )

    total_questions = len(questions)
    avg_score = 0

    if total_questions > 0:
        avg_score = round(
            sum(q.score for q in questions) / total_questions,
            2
        )

    return {
        "session_id": interview.id,
        "completed_at": interview.completed_at,
        "average_score": avg_score,
        "total_questions": total_questions,
        "questions": [
            {
                "question": q.question,
                "answer": q.user_answer,
                "evaluation": q.evaluation,
                "score": q.score
            }
            for q in questions
        ]
    }
