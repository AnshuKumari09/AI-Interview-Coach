# 🤖 AI Interview Coach

An intelligent interview preparation platform that conducts personalized mock interviews based on your resume using AI.

---

## 🚀 Features

- 📄 **Resume-Based Questions** — Upload your PDF resume and get personalized technical questions
- 🎙 **Voice Answer Support** — Answer questions via microphone with Whisper transcription
- 🔊 **AI Voice** — Interviewer speaks questions using Text-to-Speech
- 📊 **Real-time Evaluation** — Each answer is evaluated with score, strengths, weaknesses and correct answer
- 📈 **Interview History** — Track your progress with score trend charts
- 🎯 **Difficulty Levels** — Choose Easy, Medium, or Hard
- 🔐 **Secure Auth** — JWT-based login with Argon2 password hashing
- 💾 **Persistent Storage** — All interviews saved in SQLite database

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Streamlit |
| Backend | FastAPI |
| LLM | Groq API (Llama 3.3 70B) |
| Speech-to-Text | OpenAI Whisper |
| Text-to-Speech | pyttsx3 |
| Database | SQLite + SQLAlchemy |
| Auth | JWT + Argon2 |
| RAG Pipeline | ChromaDB + SentenceTransformers |
| Charts | Plotly |

---

## 📁 Project Structure
AI-Interview-Coach/
├── backend/
│   ├── main.py                  # FastAPI app & endpoints
│   ├── auth/
│   │   ├── dependencies.py      # JWT auth middleware
│   │   ├── hashing.py           # Argon2 password hashing
│   │   └── jwt_handler.py       # Token generation
│   ├── database/
│   │   ├── database.py          # SQLAlchemy setup
│   │   └── models.py            # User, InterviewSession, InterviewQuestion
│   ├── sessions/
│   │   └── interview_store.py   # In-memory session store
│   └── utils/
│       ├── answer_evaluator.py  # LLM-based answer evaluation
│       ├── question_generator.py # Resume-based question generation
│       ├── pdf_parser.py        # PDF text extraction
│       ├── resume_analyzer.py   # Resume analysis
│       ├── tts.py               # Text-to-speech
│       ├── whisper_transcriber.py # Audio transcription
│       └── rag/
│           ├── chunker.py       # Text chunking
│           ├── embedder.py      # Sentence embeddings
│           ├── retriever.py     # Context retrieval
│           └── vector_db.py     # ChromaDB integration
└── frontend/
└── app.py                   # Streamlit UI

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/AnshuKumari09/AI-Interview-Coach.git
cd AI-Interview-Coach
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file in `backend/`:
GROQ_API_KEY=your_groq_api_key
SECRET_KEY=your_jwt_secret_key

### 4. Run Backend
```bash
uvicorn main:app --reload
```

### 5. Frontend Setup
```bash
cd frontend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

### 6. Run Frontend
```bash
streamlit run app.py
```

---

## 🔄 How It Works

1. **Signup/Login** — Create account with email and password
2. **Upload Resume** — Upload your PDF resume
3. **Select Difficulty** — Choose Easy, Medium, or Hard
4. **Start Interview** — AI analyzes resume and generates 5 personalized questions
5. **Answer Questions** — Type or speak your answers
6. **Get Feedback** — Receive instant evaluation with score, strengths and weaknesses
7. **Track Progress** — View interview history and score trend chart

---

## 📸 Screenshots

> Coming soon

---

## 🙋‍♀️ Author

**Anshu Kumari**  
[GitHub](https://github.com/AnshuKumari09)

---

## 📄 License

This project is for educational and portfolio purposes.