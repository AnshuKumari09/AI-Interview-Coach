from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database.database import Base   # 🔥 IMPORTANT

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    resumes = relationship("Resume", back_populates="user")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    file_path = Column(String)
    extracted_text = Column(String)

    user = relationship("User", back_populates="resumes")

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    score = Column(Integer, nullable=True)

    user = relationship("User")

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True)

    session_id = Column(
        Integer,
        ForeignKey("interview_sessions.id")
    )

    question = Column(String)

    user_answer = Column(String)

    evaluation = Column(String)

    score = Column(Integer)

class AudioResponse(Base):
    __tablename__ = "audio_responses"

    id = Column(Integer, primary_key=True)

    session_id = Column(
        Integer,
        ForeignKey("interview_sessions.id")
    )

    audio_path = Column(String)

    transcript = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

class ResumeChunk(Base):
    __tablename__ = "resume_chunks"

    id = Column(Integer, primary_key=True)

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id")
    )

    chunk_text = Column(String)