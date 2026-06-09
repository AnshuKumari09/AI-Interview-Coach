# 🤖 AI Interview Coach

An intelligent interview preparation platform that conducts personalized mock interviews based on your resume using AI — with voice support, real-time evaluation, and progress tracking.

---

## 🚀 Features

- 📄 **Resume-Based Questions** — Upload your PDF resume and get personalized technical questions
- 📚 **Question Bank Mode** — Upload your own question bank (PDF/TXT) for targeted practice
- 🎙 **Voice Answer Support** — Answer questions via microphone with Groq Whisper transcription
- 🔊 **AI Voice** — Interviewer speaks questions using Text-to-Speech
- 🤖 **Conversational AI** — AI acknowledges your answers naturally before moving on
- 🔍 **Follow-up Questions** — AI asks deeper follow-up questions when your answer is partial
- 📊 **Real-time Evaluation** — Each answer is evaluated with score, strengths, weaknesses and correct answer
- 🎯 **Difficulty Levels** — Choose Easy, Medium, or Hard
- ⏱ **Per-Question Timer** — 2-minute countdown timer for each question
- 📈 **Progress Bar** — Track which question you are on
- 📋 **Interview History** — View all past interviews with score trend charts
- 🔐 **Secure Auth** — JWT-based login with hashed passwords
- 💾 **Persistent Storage** — All interviews saved in database

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Streamlit |
| Backend | FastAPI |
| LLM | Groq API (Llama 3.3 70B) |
| Speech-to-Text | Groq Whisper API (whisper-large-v3-turbo) |
| Text-to-Speech | gTTS |
| Database | SQLite + SQLAlchemy |
| Auth | JWT + Bcrypt |
| RAG Pipeline | ChromaDB + SentenceTransformers |
| Charts | Plotly |

---

## 📁 Project Structure

```
AI-Interview-Coach/
├── backend/
│   ├── main.py                    # FastAPI app & all endpoints
│   ├── auth/
│   │   ├── dependencies.py        # JWT auth middleware
│   │   ├── hashing.py             # Password hashing
│   │   └── jwt_handler.py         # Token generation
│   ├── database/
│   │   ├── database.py            # SQLAlchemy setup
│   │   └── models.py              # User, InterviewSession, InterviewQuestion
│   ├── sessions/
│   │   └── interview_store.py     # In-memory session store
│   └── utils/
│       ├── answer_evaluator.py    # LLM-based answer evaluation
│       ├── acknowledgement.py     # Conversational AI acknowledgements
│       ├── followup_generator.py  # Follow-up question generation
│       ├── question_generator.py  # Resume-based question generation
│       ├── qbank_extractor.py     # Question bank extraction
│       ├── pdf_parser.py          # PDF text extraction
│       ├── resume_analyzer.py     # Resume analysis
│       ├── tts.py                 # Text-to-speech (gTTS)
│       ├── whisper_transcriber.py # Audio transcription (Groq Whisper)
│       └── rag/
│           ├── chunker.py         # Text chunking
│           ├── embedder.py        # Sentence embeddings
│           ├── retriever.py       # Context retrieval
│           └── vector_db.py       # ChromaDB integration
└── frontend/
    └── app.py                     # Streamlit UI
```

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
source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file in `backend/`:
```
GROQ_API_KEY=your_groq_api_key
SECRET_KEY=your_jwt_secret_key
```

### 4. Run Backend
```bash
uvicorn main:app --reload
```

### 5. Frontend Setup
```bash
cd frontend
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
```

### 6. Run Frontend
```bash
streamlit run app.py
```

---

## 🔄 How It Works

1. **Signup/Login** — Create account with email and password
2. **Select Mode** — Resume Based or Question Bank
3. **Select Difficulty** — Easy, Medium, or Hard
4. **Select Questions** — Choose how many questions (1-20)
5. **Start Interview** — AI analyzes resume and generates personalized questions
6. **Answer Questions** — Type or speak your answers within the timer
7. **Get Feedback** — Receive instant evaluation with score, strengths, weaknesses and correct answer
8. **Follow-up** — AI asks deeper questions if your answer is partial (score 4-7)
9. **Track Progress** — View interview history and score trend chart

---

## 🎯 Interview Modes

### Resume Based
Upload your PDF resume — AI generates questions based on your projects, skills and experience.

### Question Bank
Upload your own PDF or TXT question bank — AI selects relevant questions based on difficulty and your background. Questions are selected in random order every time.

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