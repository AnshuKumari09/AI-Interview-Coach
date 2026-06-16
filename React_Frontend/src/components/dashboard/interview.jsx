import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Upload,
  FileText,
  Play,
  Loader2,
  Mic,
  MicOff,
  ChevronRight,
  Volume2,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  BookOpen,
  FileUp,
} from "lucide-react";

const BACKEND_URL = "http://localhost:8000";

// ─── Screens ────────────────────────────────────────────────────────────────
const SCREEN = {
  SETUP: "setup",
  INTERVIEW: "interview",
  DONE: "done",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(secs) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function stripLeadingNumber(text = "") {
  return text.replace(/^[Qq]?\d+[\.\)]\s*/, "").trim();
  
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CameraFeed() {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        /* camera blocked — silently skip */
      }
    })();
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  return (
    <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 left-2 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-white text-[11px]">Live</span>
      </div>
    </div>
  );
}

function CountdownTimer({ startRef, limitSecs = 120 }) {
  const [remaining, setRemaining] = useState(limitSecs);

  useEffect(() => {
    setRemaining(limitSecs);
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      const left = Math.max(0, limitSecs - elapsed);
      setRemaining(left);
      if (left === 0) clearInterval(id);
    }, 500);
    return () => clearInterval(id);
  }, [startRef.current, limitSecs]); // re-mount when timer restarts

  const urgent = remaining <= 30;

  return (
    <div
      className={`flex items-center justify-center gap-2 text-lg font-mono font-bold px-4 py-2 rounded-lg transition-colors ${
        urgent
          ? "bg-red-900/60 text-red-300 border border-red-700"
          : "bg-slate-800 text-slate-200 border border-slate-700"
      }`}
    >
      ⏱ {formatTime(remaining)}
    </div>
  );
}

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>
          Question {current} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────
function SetupScreen({ onStart }) {
  const [mode, setMode] = useState("resume"); // "resume" | "qbank"
  const [resumeFile, setResumeFile] = useState(null);
  const [qbankFile, setQbankFile] = useState(null);
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    setError("");
    if (mode === "resume" && !resumeFile) {
      setError("Please upload your resume (PDF).");
      return;
    }
    if (mode === "qbank" && !qbankFile) {
      setError("Please upload a question bank (PDF or TXT).");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in. Please refresh and log in.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      let url;

      if (mode === "resume") {
        formData.append("file", resumeFile);
        url = `${BACKEND_URL}/start-interview?difficulty=${difficulty}`;
      } else {
        formData.append("qbank", qbankFile);
        url = `${BACKEND_URL}/start-interview-qbank?difficulty=${difficulty}&num_questions=${numQuestions}`;
      }

      const { data } = await axios.post(url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onStart(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to start interview.");
    } finally {
      setLoading(false);
    }
  };

  const FileDropZone = ({ accept, file, onChange, label, hint }) => (
    <label className="block border-2 border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center cursor-pointer hover:border-violet-500 transition-colors group">
      <Upload
        size={36}
        className="text-slate-500 group-hover:text-violet-400 transition-colors"
      />
      <p className="mt-3 text-slate-300 text-sm font-medium">{label}</p>
      <p className="text-xs text-slate-500 mt-1">{hint}</p>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files[0] || null)}
      />
      {file && (
        <div className="mt-4 flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-lg text-sm text-slate-200">
          <FileText size={16} className="text-violet-400" />
          {file.name}
        </div>
      )}
    </label>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold mb-1">AI Interview Coach</h1>
          <p className="text-slate-400 text-sm mb-8">
            Upload your resume and practice with an AI-powered mock interview.
          </p>

          {/* Mode Toggle */}
          <div className="flex bg-slate-800 rounded-xl p-1 mb-6 gap-1">
            {[
              { id: "resume", icon: FileUp, label: "Resume Based" },
              { id: "qbank", icon: BookOpen, label: "Question Bank" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === id
                    ? "bg-violet-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* File upload */}
          {mode === "resume" ? (
            <FileDropZone
              accept=".pdf"
              file={resumeFile}
              onChange={setResumeFile}
              label="Click to upload resume"
              hint="PDF only"
            />
          ) : (
            <FileDropZone
              accept=".pdf,.txt"
              file={qbankFile}
              onChange={setQbankFile}
              label="Click to upload question bank"
              hint="PDF or TXT"
            />
          )}

          {/* Settings */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500 transition-colors"
              >
                {["Easy", "Medium", "Hard"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">
                Questions
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={numQuestions}
                onChange={(e) =>
                  setNumQuestions(
                    Math.min(20, Math.max(1, parseInt(e.target.value) || 1))
                  )
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 bg-red-950/60 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-xl">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full mt-6 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <>
              
                <Loader2 size={18} className="animate-spin" />
                Preparing interview…
              </>
            ) : (
              <>
                <Play size={18} />
                Start Interview
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Interview Screen ─────────────────────────────────────────────────────────
// Module-level guard — survives React StrictMode unmount/remount cycles
let _hasSpokenOnce = false;

function InterviewScreen({ sessionData, onComplete }) {
  const { session_id, db_session_id, first_question, total_questions, intro } = sessionData;

  // aiSpeaking: true = AI bol raha hai (timer hidden), false = user ka turn (timer visible)
  const [aiSpeaking, setAiSpeaking] = useState(true);
  const [question, setQuestion] = useState(first_question);
  const [currentNum, setCurrentNum] = useState(1);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [pendingNext, setPendingNext] = useState(null);
  const [isFollowup, setIsFollowup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [micBlocked, setMicBlocked] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // timerKey forces CountdownTimer to remount (reset) each new question
  const timerEpochRef = useRef(Date.now());
  const [timerKey, setTimerKey] = useState(0);

  // ── speakAsync: block until backend returns (tts.py is synchronous) ──────
  const speakAsync = async (text) => {
    setAiSpeaking(true);
    try {
      await axios.post(`${BACKEND_URL}/ai-speak`, { text });
    } catch {
      // TTS error — still give user their turn
    } finally {
      timerEpochRef.current = Date.now();
      setTimerKey((k) => k + 1);
      setAiSpeaking(false);
    }
  };

  // ── On mount: speak first question once
  // Module-level _hasSpokenOnce survives StrictMode unmount/remount (useRef does not)
  useEffect(() => {
    if (_hasSpokenOnce) return;
    _hasSpokenOnce = true;
    speakAsync(first_question);
    // Reset on unmount so "Practice Again" works correctly
    return () => { _hasSpokenOnce = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Voice recording ───────────────────────────────────────────────────────
  const startRecording = async () => {
    setError("");
    setMicBlocked(false);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Browser microphone not supported. Please use Chrome or Edge.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"]
        .find((m) => MediaRecorder.isTypeSupported(m)) || "";
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      mr.onstop = () => handleAudioStop(stream, mimeType);
      mr.start(250);
      mediaRecorderRef.current = mr;
      setRecording(true);
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicBlocked(true);
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setError("No microphone found. Please connect a mic and try again.");
      } else if (err.name === "NotReadableError") {
        setError("Mic is being used by another app. Close it and try again.");
      } else {
        setError("Microphone error: " + err.message);
      }
    }
  };

  const stopRecording = () => { mediaRecorderRef.current?.stop(); setRecording(false); };

  const handleAudioStop = async (stream, mimeType) => {
    stream.getTracks().forEach((t) => t.stop());
    setTranscribing(true);
    try {
      const ext = mimeType.includes("ogg") ? "ogg" : mimeType.includes("mp4") ? "mp4" : "webm";
      const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
      const fd = new FormData();
      fd.append("file", blob, `answer.${ext}`);
      const { data } = await axios.post(`${BACKEND_URL}/transcribe-audio`, fd);
      setAnswer((prev) => (prev ? prev + " " : "") + data.transcription);
    } catch {
      setError("Transcription failed. Please type your answer manually.");
    } finally {
      setTranscribing(false);
    }
  };

  // ── Submit answer ─────────────────────────────────────────────────────────
  const submitAnswer = async () => {
    if (!answer.trim()) { setError("Please provide an answer."); return; }
    setError("");
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${BACKEND_URL}/submit-answer`,
        { session_id, db_session_id, answer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Acknowledgement fire-and-forget (don't block UI)
      if (data.acknowledgement) {
        axios.post(`${BACKEND_URL}/ai-speak`, { text: data.acknowledgement }).catch(() => {});
      }
      if (data.evaluation) setEvaluation(data.evaluation);
      if (data.next_question) {
        setPendingNext(data.next_question);
        setIsFollowup(data.is_followup || false);
      } else {
        onComplete(data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit answer.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Next question — speak it, timer starts after AI finishes ─────────────
  const goNext = async () => {
    if (!isFollowup) setCurrentNum((n) => n + 1);
    const nextQ = pendingNext;
    setQuestion(nextQ);
    setPendingNext(null);
    setEvaluation("");
    setAnswer("");
    setIsFollowup(false);
    await speakAsync(nextQ);
  };

  const speakQuestion = () => speakAsync(question);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-5">

          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">AI Interview Room</h2>
            <div className="flex items-center gap-3">
              <CameraFeed />
              <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-800">Live</span>
            </div>
          </div>

          <ProgressBar current={currentNum} total={total_questions} />

          {/* Timer — show "AI speaking" banner while AI talks, countdown after */}
          {aiSpeaking ? (
            <div className="flex items-center justify-center gap-2 bg-violet-900/30 border border-violet-700 px-4 py-3 rounded-lg text-violet-300 text-sm">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse inline-block" />
              AI is speaking… your timer will start after
            </div>
          ) : (
            <CountdownTimer key={timerKey} startRef={timerEpochRef} />
          )}

          {/* Question card */}
          <div className="bg-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                {isFollowup ? "Follow-up" : `Question ${currentNum}`}
              </span>
              <button
                onClick={speakQuestion}
                disabled={aiSpeaking}
                className="text-slate-400 hover:text-violet-400 disabled:opacity-40 transition-colors flex items-center gap-1 text-xs"
              >
                <Volume2 size={14} /> Speak
              </button>
            </div>
            <p className="text-white text-lg leading-relaxed">{stripLeadingNumber(question)}</p>
          </div>

          {/* Feedback + Next Question */}
          {evaluation && (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-violet-300 text-sm font-semibold">
                <CheckCircle size={15} /> AI Feedback
              </div>
              <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{evaluation}</p>
              {isFollowup && (
                <p className="text-amber-400 text-xs mt-1">🔍 Interviewer wants to know more…</p>
              )}
              {pendingNext && (
                <button
                  onClick={goNext}
                  disabled={aiSpeaking}
                  className="mt-3 flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  {aiSpeaking
                    ? <><Loader2 size={14} className="animate-spin" /> Speaking…</>
                    : <>Next Question <ChevronRight size={16} /></>}
                </button>
              )}
            </div>
          )}

          {/* Answer area — hidden while waiting for next question */}
          {!pendingNext && (
            <>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here…"
                rows={5}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-white outline-none focus:border-violet-500 resize-none transition-colors placeholder:text-slate-500"
              />

              {micBlocked ? (
                <div className="bg-amber-950/50 border border-amber-700 rounded-xl p-4 text-sm space-y-2">
                  <p className="text-amber-300 font-medium flex items-center gap-2"><MicOff size={15} /> Microphone permission blocked</p>
                  <p className="text-amber-200/80 text-xs leading-relaxed">
                    Chrome mein fix karo: <strong>address bar ke left side mein 🔒 → Microphone → Allow</strong> → phir page refresh karo.
                  </p>
                  <p className="text-amber-200/60 text-xs">Ya niche text box mein type karke answer do.</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 flex-wrap">
                  {!recording ? (
                    <button
                      onClick={startRecording}
                      disabled={transcribing || aiSpeaking}
                      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50"
                    >
                      <Mic size={15} className="text-violet-400" />
                      {transcribing ? "Transcribing…" : "🎙 Voice Answer"}
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="flex items-center gap-2 bg-red-900/50 hover:bg-red-900/80 border border-red-700 px-4 py-2 rounded-xl text-sm transition-colors animate-pulse"
                    >
                      <MicOff size={15} className="text-red-400" /> ⏹ Stop Recording
                    </button>
                  )}
                  {transcribing && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Loader2 size={12} className="animate-spin" /> Transcribing…
                    </span>
                  )}
                  {recording && (
                    <span className="text-xs text-red-400 flex items-center gap-1 animate-pulse">● Recording...</span>
                  )}
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 bg-red-950/60 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-xl">
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              <button
                onClick={submitAnswer}
                disabled={submitting || aiSpeaking}
                className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {submitting
                  ? <><Loader2 size={16} className="animate-spin" /> Evaluating…</>
                  : "Submit Answer"}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}


function DoneScreen({ result, onRetry }) {
  const summary = result?.summary;
  const avg = summary?.average_score ?? 0;

  const tier =
    avg >= 8
      ? {
          emoji: "🌟",
          title: "Outstanding Performance!",
          msg: "You demonstrated strong technical knowledge. You're well prepared for real interviews. Keep it up! 🚀",
          color: "green",
        }
      : avg >= 5
      ? {
          emoji: "💪",
          title: "Good Effort!",
          msg: "You have a solid foundation. Focus on explaining concepts more clearly and precisely. Practice daily and you'll ace your interviews! 🎯",
          color: "blue",
        }
      : {
          emoji: "🌱",
          title: "Keep Practicing!",
          msg: "Every expert was once a beginner. Review the correct answers and practice again. Consistency is key! 💡",
          color: "amber",
        };

  const colorMap = {
    green: "bg-green-900/40 border-green-700 text-green-200",
    blue: "bg-blue-900/40 border-blue-700 text-blue-200",
    amber: "bg-amber-900/40 border-amber-700 text-amber-200",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl font-bold">Interview Complete!</h2>
            <p className="text-slate-400 text-sm mt-1">Great job finishing the session.</p>
          </div>

          {summary && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-violet-400">
                  {summary.average_score}
                  <span className="text-lg text-slate-400">/10</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Average Score</p>
              </div>
              <div className="bg-slate-800 rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-violet-400">
                  {summary.total_questions}
                </p>
                <p className="text-xs text-slate-400 mt-1">Questions Answered</p>
              </div>
            </div>
          )}

          <div className={`border rounded-2xl p-5 ${colorMap[tier.color]}`}>
            <p className="font-semibold text-lg mb-1">
              {tier.emoji} {tier.title}
            </p>
            <p className="text-sm leading-relaxed">{tier.msg}</p>
          </div>

          {summary?.feedback && (
            <p className="text-slate-400 text-sm text-center">
              {summary.feedback}
            </p>
          )}

          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 py-3 rounded-xl font-semibold transition-colors"
          >
            <RotateCcw size={16} />
            Practice Again
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────
export default function Interview() {
  const [screen, setScreen] = useState(SCREEN.SETUP);
  const [sessionData, setSessionData] = useState(null);
  const [doneResult, setDoneResult] = useState(null);

  const handleStart = (data) => {
    setSessionData(data);
    setScreen(SCREEN.INTERVIEW);
    // Speak intro + first question
    axios
      .post(`${BACKEND_URL}/ai-speak`, {
        text: (data.intro || "") + "\n\n" + data.first_question,
      })
      .catch(() => {});
  };

  const handleComplete = (result) => {
    setDoneResult(result);
    setScreen(SCREEN.DONE);
  };

  const handleRetry = () => {
    setSessionData(null);
    setDoneResult(null);
    setScreen(SCREEN.SETUP);
  };

  if (screen === SCREEN.INTERVIEW && sessionData) {
    return (
      <InterviewScreen sessionData={sessionData} onComplete={handleComplete} />
    );
  }

  if (screen === SCREEN.DONE) {
    return <DoneScreen result={doneResult} onRetry={handleRetry} />;
  }

  return <SetupScreen onStart={handleStart} />;
}
