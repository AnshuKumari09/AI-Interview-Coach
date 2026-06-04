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
# @app.post("/upload-resume")
# async def upload_resume(
#     file: UploadFile = File(...),
#     user: str = Depends(get_current_user)
# ):

#     # Extension nikalo
#     extension = file.filename.split(".")[-1].lower()

#     allowed_extensions = ["pdf", "docx"]

#     if extension not in allowed_extensions:
#         return {"error": "Unsupported file type"}

#     content = await file.read()

#     unique_id = str(uuid.uuid4())[:8]
#     unique_filename = f"{unique_id}_{file.filename}"
#     file_path = f"uploads/{unique_filename}"

#     with open(file_path, "wb") as f:
#         f.write(content)

#     try:
#         if extension == "pdf":
#             text = extract_pdf_text(file_path)
#         else:
#             text = extract_docx_text(file_path)

#         cleaned_text = clean_text(text)
#         chunks = chunk_text(cleaned_text)
#         embeddings = [get_embedding(c) for c in chunks]
        

#         print("TOTAL CHUNKS:", len(chunks))

#         for i, c in enumerate(chunks):
#             print(f"\nCHUNK {i+1}\n")
    
#             print(c[:100])

#         add_chunks(chunks, embeddings)

#         return {
#             "filename": unique_filename,
#             "text": cleaned_text,
#             "uploaded_by": user   # 👈 important (from JWT)
#         }

#     except Exception as e:
#         return {
#             "message": "Failed to process resume",
#             "error": str(e)
#         }

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

    session = interview_sessions.get(
        request.session_id
    )

    if not session:
        return {
            "error": "Invalid session"
        }

    current_index = session[
        "current_question"
    ]

    questions = session["questions"]

    current_question = questions[
        current_index
    ]

    evaluation = evaluate_answer(
        current_question,
        request.answer
    )

    question_row = InterviewQuestion(
        session_id=request.db_session_id,
        question=current_question,
        user_answer=request.answer,
        evaluation=evaluation,
        score=8
    )

    db.add(question_row)
    db.commit()

    session["scores"].append(
        evaluation
    )

    session["current_question"] += 1

    if session["current_question"] >= len(
        questions
    ):

        db_session = (
            db.query(InterviewSession)
            .filter(
                InterviewSession.id ==
                request.db_session_id
            )
            .first()
        )

        if db_session:
            db_session.completed_at = \
                datetime.utcnow()

            db_session.score = 80

            db.commit()

        return {
            "message":
            "Interview Completed",

            "evaluations":
            session["scores"]
        }

    next_question = questions[
        session["current_question"]
    ]

    return {
        "evaluation": evaluation,
        "next_question": next_question
    }


@app.post("/mock-interview")
async def mock_interview(file: UploadFile = File(...)):

    # extension nikalo
    extension = file.filename.split(".")[-1].lower()

    # validation
    if extension not in ["pdf", "docx"]:
        return {
            "error": "Unsupported file type"
        }

    # file read
    content = await file.read()

    # unique filename
    unique_id = str(uuid.uuid4())[:8]

    unique_filename = f"{unique_id}_{file.filename}"

    file_path = f"uploads/{unique_filename}"

    # save file
    with open(file_path, "wb") as f:
        f.write(content)

    # text extraction
    if extension == "pdf":
        resume_text = extract_pdf_text(file_path)

    else:
        resume_text = extract_docx_text(file_path)

    # cleaning
    resume_text = clean_text(resume_text)

    # analysis
    analysis = analyze_resume(resume_text)

    # questions
    questions = generate_questions(resume_text)

    return {
        "filename": unique_filename,
        "analysis": analysis,
        "questions": questions
    }

@app.post("/start-interview")
async def start_interview(
    file: UploadFile = File(...),
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
        resume_text
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

    return {
        "session_id": session_id,
        "db_session_id": db_session.id,
        "analysis": analysis,
        "first_question": questions[0]
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
