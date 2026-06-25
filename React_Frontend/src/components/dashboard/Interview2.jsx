import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Upload,
  FileText,
  Play,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  ChevronRight,
  RotateCcw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// const BACKEND_URL = "http://localhost:8000";
const BACKEND_URL = "https://ai-interview-coach-0mp0.onrender.com"
// ─────────────────────────────────────────────
// Utility: speak via backend
// ─────────────────────────────────────────────
async function speakAsync(text) {
  try {
    await axios.post(`${BACKEND_URL}/ai-speak`, { text });
  } catch (err) {
    console.log("Voice error", err);
  }
}

// ─────────────────────────────────────────────
// Timer component
// ─────────────────────────────────────────────
function Timer({ startTime, limit = 120 }) {
  const [remaining, setRemaining] = useState(limit);

  useEffect(() => {
    setRemaining(limit); // reset on new question
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setRemaining(Math.max(0, limit - elapsed));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, limit]);

  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");
  const isLow = remaining <= 30;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold transition-colors ${
        isLow ? "bg-red-500/20 text-red-400" : "bg-slate-800 text-slate-200"
      }`}
    >
      ⏱ {mins}:{secs}
    </div>
  );
}

// ─────────────────────────────────────────────
// Progress Bar
// ─────────────────────────────────────────────
function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-slate-400 mb-2">
        <span>Question {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Setup Screen
// ─────────────────────────────────────────────
function SetupScreen({ onStart, loading }) {
  const [mode, setMode] = useState("resume"); // "resume" | "qbank"
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [resumeFile, setResumeFile] = useState(null);
  const [qbankFile, setQbankFile] = useState(null);

  const handleStart = () => {
    onStart({ mode, difficulty, numQuestions, resumeFile, qbankFile });
  };

  const canStart =
    (mode === "resume" && resumeFile) || (mode === "qbank" && qbankFile);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">
      <h1 className="text-4xl font-bold mb-2">AI Interview Coach</h1>
      <p className="text-slate-400 mb-8">
        Configure your mock interview and start practising.
      </p>

      {/* Mode Toggle */}
      <div className="flex gap-3 mb-8">
        {["resume", "qbank"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
              mode === m
                ? "bg-violet-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {m === "resume" ? "📄 Resume Based" : "📚 Question Bank"}
          </button>
        ))}
      </div>

      {/* File Upload */}
      {mode === "resume" ? (
        <FileUpload
          label="Upload Resume (PDF)"
          accept=".pdf"
          file={resumeFile}
          onChange={setResumeFile}
        />
      ) : (
        <FileUpload
          label="Upload Question Bank (PDF / TXT)"
          accept=".pdf,.txt"
          file={qbankFile}
          onChange={setQbankFile}
        />
      )}

      {/* Difficulty */}
      <div className="mt-6">
        <label className="block text-sm text-slate-400 mb-2">
          Difficulty Level
        </label>
        <div className="flex gap-3">
          {["Easy", "Medium", "Hard"].map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`flex-1 py-2 rounded-xl font-medium text-sm transition-colors ${
                difficulty === d
                  ? d === "Easy"
                    ? "bg-green-600 text-white"
                    : d === "Medium"
                    ? "bg-yellow-600 text-white"
                    : "bg-red-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Number of questions */}
      <div className="mt-6">
        <label className="block text-sm text-slate-400 mb-2">
          Number of Questions: <span className="text-white font-bold">{numQuestions}</span>
        </label>
        <input
          type="range"
          min={1}
          max={20}
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
          className="w-full accent-violet-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>1</span>
          <span>20</span>
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={loading || !canStart}
        className="w-full mt-8 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Preparing Interview…
          </>
        ) : (
          <>
            <Play size={18} />
            Start Interview
          </>
        )}
      </button>
    </div>
  );
}

function FileUpload({ label, accept, file, onChange }) {
  return (
    <div>
      <label className="border-2 border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 transition-colors">
        <Upload size={40} className="text-slate-500" />
        <p className="mt-3 text-slate-300">{label}</p>
        <p className="text-xs text-slate-500 mt-1">Click to browse</p>
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files[0])}
        />
      </label>
      {file && (
        <div className="mt-3 flex items-center gap-3 bg-slate-800 p-3 rounded-xl">
          <FileText size={18} className="text-violet-400" />
          <span className="text-sm truncate">{file.name}</span>
          <CheckCircle size={16} className="text-green-400 ml-auto shrink-0" />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Interview Screen
// ─────────────────────────────────────────────
function InterviewScreen({ question, questionNum, totalQuestions, timerStart, onSubmit, submitting, evaluation, pendingNext, onNextQuestion, isFollowup }) {
  const [answer, setAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Reset answer on new question
  useEffect(() => {
    setAnswer("");
  }, [question]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      alert("Microphone access denied. Please allow mic permission.");
      console.error(err);
    }
  };

  const stopListening = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    setIsListening(false);
    setTranscribing(true);

    mediaRecorder.onstop = async () => {
      try {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("file", audioBlob, "answer.wav");

        const response = await axios.post(
          `${BACKEND_URL}/transcribe-audio`,
          formData
        );

        const transcription = response.data.transcription;
        if (transcription) {
          setAnswer((prev) => (prev ? prev + " " + transcription : transcription));
        }
      } catch (err) {
        console.error("Transcription error:", err);
        alert("Transcription failed. Please type your answer manually.");
      } finally {
        setTranscribing(false);
      }
    };

    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach((t) => t.stop());
  };

  // Sanitize question numbering prefix
  const cleanQuestion = question.replace(/^[Qq]?\d+[\.\)]\s*/, "").trim();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">AI Interview Room</h2>
        <div className="flex items-center gap-3">
          <Timer startTime={timerStart} limit={120} />
          <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium">
            ● Live
          </span>
        </div>
      </div>

      {/* Progress */}
      <ProgressBar current={questionNum} total={totalQuestions} />

      {/* Question Card */}
      <div className="bg-slate-800 p-6 rounded-2xl mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-slate-400 text-sm">
            {isFollowup ? "🔍 Follow-up Question" : `Question ${questionNum}`}
          </p>
          <button
            onClick={() => speakAsync(question)}
            className="flex items-center gap-1 text-slate-400 hover:text-violet-400 text-sm transition-colors"
          >
            <Volume2 size={14} />
            Speak
          </button>
        </div>
        <h3 className="text-lg leading-relaxed">{cleanQuestion}</h3>
      </div>

      {/* Feedback Section (after submit) */}
      {evaluation && pendingNext && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 mb-6">
          <h4 className="font-semibold text-violet-400 mb-3 flex items-center gap-2">
            <CheckCircle size={16} />
            AI Feedback
          </h4>
          <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
            {evaluation}
          </p>
          {isFollowup && (
            <p className="mt-3 text-yellow-400 text-sm">
              🔍 Interviewer wants to know more…
            </p>
          )}
          <button
            onClick={onNextQuestion}
            className="mt-5 bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
          >
            Next Question
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Answer Section */}
      {!pendingNext && (
        <>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type or speak your answer…"
            className="w-full h-36 bg-slate-800 rounded-xl p-4 outline-none resize-none text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 transition"
          />

          <div className="flex items-center gap-3 mt-3">
            {transcribing ? (
              <div className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-xl text-sm text-slate-300">
                <Loader2 size={15} className="animate-spin" />
                Transcribing…
              </div>
            ) : !isListening ? (
              <button
                onClick={startListening}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <Mic size={15} />
                Start Speaking
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <MicOff size={15} />
                Stop Recording
              </button>
            )}
            {isListening && (
              <span className="text-red-400 text-sm animate-pulse">
                ● Recording…
              </span>
            )}
          </div>

          <button
            onClick={() => onSubmit(answer)}
            disabled={submitting}
            className="mt-5 w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Evaluating…
              </>
            ) : (
              "Submit Answer"
            )}
          </button>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Completion Screen
// ─────────────────────────────────────────────
function CompletionScreen({ result, lastEvaluation, onReset }) {
  const summary = result?.summary || {};
  const avg = summary.average_score || 0;

  const badge =
    avg >= 8
      ? { emoji: "🌟", title: "Outstanding Performance!", msg: "You demonstrated strong technical knowledge. Well prepared for real interviews. Keep it up! 🚀", color: "text-green-400" }
      : avg >= 5
      ? { emoji: "💪", title: "Good Effort!", msg: "Solid foundation. Focus on explaining concepts more clearly. Practice daily to ace your interviews! 🎯", color: "text-yellow-400" }
      : { emoji: "🌱", title: "Keep Practising!", msg: "Every expert was once a beginner. Review the feedback above and practice again. Consistency is key! 💡", color: "text-violet-400" };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{badge.emoji}</div>
        <h2 className="text-3xl font-bold mb-2">Interview Complete!</h2>
        <p className={`text-lg font-semibold ${badge.color}`}>{badge.title}</p>
        <p className="text-slate-400 mt-2 max-w-md mx-auto">{badge.msg}</p>
      </div>

      {/* Stats */}
      {summary.total_questions && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-800 rounded-2xl p-5 text-center">
            <p className="text-slate-400 text-sm mb-1">Questions Answered</p>
            <p className="text-3xl font-bold">{summary.total_questions}</p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-5 text-center">
            <p className="text-slate-400 text-sm mb-1">Average Score</p>
            <p className="text-3xl font-bold">
              {summary.average_score}
              <span className="text-slate-400 text-lg">/10</span>
            </p>
          </div>
        </div>
      )}

      {summary.feedback && (
        <div className="bg-slate-800 rounded-2xl p-5 mb-6">
          <h4 className="font-semibold text-violet-400 mb-2">Overall Feedback</h4>
          <p className="text-slate-300 text-sm leading-relaxed">{summary.feedback}</p>
        </div>
      )}

      {lastEvaluation && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 mb-6">
          <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <AlertCircle size={15} />
            Last Answer Feedback
          </h4>
          <p className="text-slate-400 text-sm whitespace-pre-wrap">{lastEvaluation}</p>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full bg-violet-600 hover:bg-violet-700 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <RotateCcw size={16} />
        Practice Again
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Root Component
// ─────────────────────────────────────────────
export default function Interview() {
  const [phase, setPhase] = useState("setup"); // "setup" | "interview" | "done"
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Interview state
  const [sessionId, setSessionId] = useState("");
  const [dbSessionId, setDbSessionId] = useState("");
  const [question, setQuestion] = useState("");
  const [questionNum, setQuestionNum] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [timerStart, setTimerStart] = useState(Date.now());

  // Post-submit state
  const [evaluation, setEvaluation] = useState("");
  const [pendingNext, setPendingNext] = useState("");
  const [isFollowup, setIsFollowup] = useState(false);

  // Completion
  const [finalResult, setFinalResult] = useState(null);
  const [lastEvaluation, setLastEvaluation] = useState("");

  // ── Start Interview ──
  const handleStart = async ({ mode, difficulty, numQuestions, resumeFile, qbankFile }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      let response;

      if (mode === "qbank") {
        const formData = new FormData();
        formData.append("qbank", qbankFile);
        response = await axios.post(
          `${BACKEND_URL}/start-interview-qbank`,
          formData,
          { headers, params: { difficulty, num_questions: numQuestions } }
        );
      } else {
        const formData = new FormData();
        formData.append("file", resumeFile);
        response = await axios.post(
          `${BACKEND_URL}/start-interview`,
          formData,
          { headers, params: { difficulty } }
        );
      }

      const data = response.data;
      setSessionId(data.session_id);
      setDbSessionId(data.db_session_id);
      setQuestion(data.first_question);
      setTotalQuestions(data.total_questions || numQuestions);
      setQuestionNum(1);
      setTimerStart(Date.now());
      setEvaluation("");
      setPendingNext("");
      setPhase("interview");

      // Speak intro + first question
      speakAsync((data.intro ? data.intro + "\n\n" : "") + data.first_question);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.detail || "Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  // ── Submit Answer ──
  const handleSubmit = async (answer) => {
    if (!answer.trim()) {
      alert("Please provide an answer first");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BACKEND_URL}/submit-answer`,
        { session_id: sessionId, db_session_id: dbSessionId, answer },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const result = response.data;

      if (result.evaluation) {
        setEvaluation(result.evaluation);
        setLastEvaluation(result.evaluation);
      }

      if (result.acknowledgement) {
        speakAsync(result.acknowledgement);
      }

      if (result.next_question) {
        setPendingNext(result.next_question);
        setIsFollowup(result.is_followup || false);
      } else {
        // Interview done
        setFinalResult(result);
        setPhase("done");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Next Question ──
  const handleNextQuestion = () => {
    if (!isFollowup) {
      setQuestionNum((n) => n + 1);
    }
    setQuestion(pendingNext);
    setTimerStart(Date.now());
    setEvaluation("");
    setPendingNext("");
    setIsFollowup(false);
    speakAsync(pendingNext);
  };

  // ── Reset ──
  const handleReset = () => {
    setPhase("setup");
    setQuestion("");
    setQuestionNum(1);
    setEvaluation("");
    setPendingNext("");
    setFinalResult(null);
    setLastEvaluation("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl">
        {phase === "setup" && (
          <SetupScreen onStart={handleStart} loading={loading} />
        )}
        {phase === "interview" && (
          <InterviewScreen
            question={question}
            questionNum={questionNum}
            totalQuestions={totalQuestions}
            timerStart={timerStart}
            onSubmit={handleSubmit}
            submitting={submitting}
            evaluation={evaluation}
            pendingNext={pendingNext}
            onNextQuestion={handleNextQuestion}
            isFollowup={isFollowup}
          />
        )}
        {phase === "done" && (
          <CompletionScreen
            result={finalResult}
            lastEvaluation={lastEvaluation}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}




// import { useState } from "react";
// import { speakAsync, startInterviewApi, submitAnswerApi } from "../../api/backend";
// import { CompletionScreen, InterviewScreen, SetupScreen } from "../InterviewScreens";

// export default function Interview() {
//   const [phase, setPhase] = useState("setup");

//   const [sessionId, setSessionId] = useState("");
//   const [dbSessionId, setDbSessionId] = useState("");

//   const [question, setQuestion] = useState("");
//   const [questionNum, setQuestionNum] = useState(1);
//   const [totalQuestions, setTotalQuestions] = useState(5);

//   const [timerStart, setTimerStart] = useState(Date.now());

//   const [evaluation, setEvaluation] = useState("");
//   const [pendingNext, setPendingNext] = useState("");

//   const [finalResult, setFinalResult] = useState(null);
//   const [lastEvaluation, setLastEvaluation] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   // ───────── START ─────────
//   const handleStart = async (data) => {
//     const token = localStorage.getItem("token");

//     setLoading(true);

//     try {
//       const res = await startInterviewApi({ ...data, token });
//       const r = res.data;

//       setSessionId(r.session_id);
//       setDbSessionId(r.db_session_id);
//       setQuestion(r.first_question);
//       setTotalQuestions(r.total_questions || data.numQuestions);
//       setTimerStart(Date.now());

//       setPhase("interview");

//       speakAsync(r.first_question);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ───────── SUBMIT ─────────
//   const handleSubmit = async (answer) => {
//     const token = localStorage.getItem("token");
//     setSubmitting(true);

//     try {
//       const res = await submitAnswerApi({
//         sessionId,
//         dbSessionId,
//         answer,
//         token
//       });

//       const r = res.data;

//       setEvaluation(r.evaluation);
//       setLastEvaluation(r.evaluation);

//       if (r.next_question) {
//         setPendingNext(r.next_question);
//       } else {
//         setFinalResult(r);
//         setPhase("done");
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ───────── NEXT ─────────
//   const handleNext = () => {
//     setQuestion(pendingNext);
//     setQuestionNum((n) => n + 1);
//     setPendingNext("");
//     setEvaluation("");
//     setTimerStart(Date.now());

//     speakAsync(pendingNext);
//   };

//   // ───────── RESET ─────────
//   const reset = () => {
//     setPhase("setup");
//     setQuestionNum(1);
//     setEvaluation("");
//     setFinalResult(null);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-950">
//       {phase === "setup" && (
//         <SetupScreen onStart={handleStart} loading={loading} />
//       )}

//       {phase === "interview" && (
//         <InterviewScreen
//           question={question}
//           questionNum={questionNum}
//           totalQuestions={totalQuestions}
//           timerStart={timerStart}
//           onSubmit={handleSubmit}
//           submitting={submitting}
//           evaluation={evaluation}
//           pendingNext={pendingNext}
//           onNextQuestion={handleNext}
//         />
//       )}

//       {phase === "done" && (
//         <CompletionScreen
//           result={finalResult}
//           lastEvaluation={lastEvaluation}
//           onReset={reset}
//         />
//       )}
//     </div>
//   );
// }