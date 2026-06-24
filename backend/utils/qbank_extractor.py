import uuid
import random
from utils.llm import llm

def extract_questions_from_bank(qbank_text, difficulty, resume_text, num_questions=5):
    seed = str(uuid.uuid4())[:8]

    # ── Step 1: PDF ka summary / overview banao ──────────────────────────────
    summary_prompt = f"""
You are an expert content analyzer.

Read the following document carefully and create a structured summary:

DOCUMENT:
{qbank_text[:3000]}

Provide:
1. TOPICS COVERED: List all major topics, concepts, technologies mentioned.
2. EXISTING QUESTIONS: List any actual interview questions already present (if any). Write "NONE" if no questions found.
3. KEY CONCEPTS: List important concepts that can be tested in an interview.

Be concise and structured.
"""
    summary_response = llm.invoke(summary_prompt)
    summary = summary_response.content.strip()

    # ── Step 2: Summary ke basis pe questions generate karo ─────────────────
    question_prompt = f"""
You are a technical interviewer. Session ID: {seed}

DOCUMENT SUMMARY:
{summary}

ORIGINAL DOCUMENT (for reference):
{qbank_text[:2000]}

Candidate resume:
{resume_text[:300] if resume_text else "Not provided"}

Difficulty level: {difficulty}

INSTRUCTIONS:
- If the document already contains interview questions, PREFER using those directly.
- For remaining questions (or if no questions exist), generate NEW questions based on the topics and concepts in the summary.
- All questions must be relevant to the topics in the document.
- Match difficulty: {difficulty} (Easy = basic concepts, Medium = applied knowledge, Hard = deep understanding + edge cases)
- Do NOT ask meta questions about the document itself.
- Generate EXACTLY {num_questions} questions total.
- Return ONLY the questions, numbered 1 to {num_questions}, one per line.
- No extra text, no explanations.

Output:
1. [question]
2. [question]
"""

    response = llm.invoke(question_prompt)
    questions = [
        q.strip()
        for q in response.content.split("\n")
        if q.strip() and q.strip()[0].isdigit()
    ]

    random.shuffle(questions)
    return questions[:num_questions]
