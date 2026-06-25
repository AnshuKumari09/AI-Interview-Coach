import React, { useEffect, useRef, useState } from "react";
import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiSettings,
} from "react-icons/fi";
import { BiVideoRecording } from "react-icons/bi";
import { Loader2, Play } from "lucide-react";
import axios from "axios";
import InterviewRoomSidebar from "./InterviewRoomSidebar";
import InterviewCompletion from "./InterviewCompletion";
import { useLocation, useNavigate } from "react-router-dom";
import ai from "../../images/ai.png";

const BACKEND_URL = "https://ai-interview-coach-0mp0.onrender.com"

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
    <div className="relative h-full w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="object-cover h-full w-full"
      />
      <div className="absolute top-2 left-2 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-white text-[11px]">Live</span>
      </div>
    </div>
  );
}

const InterviewRoom = () => {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [doneResult, setDoneResult] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [answer, setAnswer] = useState("");
  const [pendingNext, setPendingNext] = useState("");
  const [isFollowup, setIsFollowup] = useState(false); // 🐛 FIX 1: track follow-up vs real question
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [recording, setRecording] = useState(false);
  const [currentQuestionNo, setCurrentQuestionNo] = useState(1);
  const [screen, setScreen] = useState("interview"); // "interview" | "done"

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [isMuted, setIsMuted] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const {
    mode,
    resumeFile,
    pdfFile,
    difficulty,
    numQuestions,
    from, // 🐛 FIX 2: origin path passed from setup page, used for "Practice Again"
  } = location.state;

  // Removes leading "Question 1:", "Q1.", "Question 1 -", etc. before speaking
  function stripLeadingNumber(text = "") {
    return text.replace(/^([Qq]?\d+[\.\)]\s*)+/, "").trim();
  }

  const speakAsync = async (text) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/ai-speak`,
        { text },
        { responseType: "blob" }
      );
      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (err) {
      console.log("Voice error:", err);
    }
  };

  const startInterview = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      let response;

      if (mode === "resume") {
        const formData = new FormData();
        formData.append("file", resumeFile);
        response = await axios.post(`${BACKEND_URL}/start-interview`, formData, {
          headers,
          params: { difficulty },
        });
      }

      if (mode === "qbank") {
        const formData = new FormData();
        formData.append("qbank", pdfFile);
        response = await axios.post(`${BACKEND_URL}/start-interview-qbank`, formData, {
          headers,
          params: { difficulty, num_questions: numQuestions },
        });
      }

      const data = response.data;
      setSessionData(data);
      setCurrentQuestion(data.first_question);

      setConversations([
        { role: "ai", type: "question", message: data.first_question },
      ]);

      await speakAsync(
        (data.intro ? data.intro + "\n\n" : "") + stripLeadingNumber(data.first_question)
      );
    } catch (err) {
      console.log("ERROR:", err.response?.data);
      console.log("STATUS:", err.response?.status);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    if (isMuted) {
      alert("Microphone is muted");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => handleAudioStop(stream);
      recorder.start();

      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch (err) {
      console.log(err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleAudioStop = async (stream) => {
    stream.getTracks().forEach((track) => track.stop());

    try {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", blob, "answer.webm");

      const { data } = await axios.post(`${BACKEND_URL}/transcribe-audio`, formData);
      const transcript = data.transcription;

      setAnswer(transcript);
      await submitAnswerToBackend(transcript);
    } catch (err) {
      console.log(err);
    }
  };

  const submitAnswerToBackend = async (userAnswer) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BACKEND_URL}/submit-answer`,
        {
          session_id: sessionData.session_id,
          db_session_id: sessionData.db_session_id,
          answer: userAnswer,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const result = response.data;

      setConversations((prev) => [
        ...prev,
        { role: "user", type: "answer", message: userAnswer },
        { role: "ai", type: "review", message: result.evaluation },
      ]);

      setAnswer("");

      // 🐛 FIX 1: don't let real-question count exceed numQuestions.
      // Follow-ups don't count toward the limit; only real questions do.
      const wouldExceedLimit =
        !result.is_followup && currentQuestionNo >= numQuestions;

      if (result.next_question && !wouldExceedLimit) {
        setPendingNext(result.next_question);
        setIsFollowup(result.is_followup || false);
      } else {
        // ✅ interview finished — either backend said so, or we hit the
        // question limit ourselves as a safety net against backend over-asking
        setPendingNext("");
        setIsFollowup(false);
        setDoneResult(
          result.summary
            ? result
            : {
                ...result,
                summary: {
                  average_score: result.average_score ?? null,
                  total_questions: numQuestions,
                  feedback: result.feedback ?? "Interview complete.",
                },
              }
        );
        setScreen("done");
      }
    } catch (err) {
      console.log("FULL ERROR");
      console.log(err.response?.data);
      console.log(err.response?.status);
    }
  };

  const handleNextQuestion = async () => {
    if (!pendingNext) return;

    // 🐛 FIX 1: only increment the visible counter on real questions,
    // never on follow-ups
    if (!isFollowup) {
      setCurrentQuestionNo((prev) => prev + 1);
    }

    setConversations((prev) => [
      ...prev,
      { role: "ai", type: "question", message: pendingNext },
    ]);

    setCurrentQuestion(pendingNext);
    await speakAsync(stripLeadingNumber(pendingNext));
    setPendingNext("");
    setIsFollowup(false);
  };

  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    startInterview();
  }, []);

  // ── Completion screen ───────────────────────────────────────────────────
  if (screen === "done") {
    return (
      <InterviewCompletion
        result={doneResult}
        // 🐛 FIX 2: go back to wherever the user actually started from,
        // falling back to "/" if "from" wasn't passed
        onRetry={() => navigate(from || "/upload", { replace: true })}
      />
    );
  }

  return (
    <div className="h-screen bg-[#09091B] text-white overflow-hidden">
      {/* Top Border */}
      <div className="h-[4px] w-full bg-gradient-to-r from-violet-600 via-blue-600 to-violet-600" />

      <div className="flex h-[calc(100vh-4px)]">
        {/* Sidebar */}
        <InterviewRoomSidebar conversations={conversations} />

        {/* Main Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-16 border-b border-white/10 flex items-center justify-between px-8">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-500">Theoretical Question</span>
              <span className="font-medium text-white">Javascript</span>
            </div>

            <div className="flex items-center gap-3">
              <FiSettings className="text-lg text-gray-400" />
              <span className="text-gray-300">0:00</span>
            </div>
          </div>

          <span className="font-medium text-white px-8 pt-2">
            {isFollowup
              ? "Follow-up"
              : `Question ${currentQuestionNo} / ${numQuestions}`}
          </span>

          {/* Video Section */}
          <div className="flex-1 flex items-center justify-center p-20">
            <div className="w-full max-w-5xl h-[700px] bg-[#11112A] border border-white/5 rounded-xl p-30 flex flex-col items-center justify-center relative">
              <div className="flex gap-6">
                {/* AI Video */}
                <div className="w-[400px] h-[360px] bg-[#1A1A35] rounded-md flex items-center justify-center relative">
                  <div className="w-full h-full rounded-lg bg-violet-500/20 border border-violet-500 flex items-center justify-center">
                    <img src={ai} className="object-contain h-full w-full" alt="AI Interviewer" />
                  </div>
                </div>

                {/* User Video */}
                <div className="w-[400px] h-[360px] rounded-md overflow-hidden bg-black">
                  <CameraFeed />
                </div>
              </div>

              <button
                onClick={handleNextQuestion}
                disabled={!pendingNext}
                className="w-[70%] mt-40 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Preparing interview…
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Next Question
                  </>
                )}
              </button>

              {/* Controls */}
              <div className="absolute bottom-35 flex items-center gap-4">
                <button className="w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center">
                  <FiVideo className="text-white" />
                </button>

                <div className="flex flex-col gap-2 items-center">
                  {recording ? (
                    <button
                      onClick={stopRecording}
                      className="w-14 h-10 rounded-lg bg-red-600 flex items-center justify-center"
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      onClick={startRecording}
                      className="w-14 h-10 rounded-lg bg-green-600 flex items-center justify-center"
                    >
                      <BiVideoRecording className="text-white text-lg" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setIsMuted((prev) => !prev)}
                  className="w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center"
                >
                  {isMuted ? (
                    <FiMicOff className="text-red-500" />
                  ) : (
                    <FiMic className="text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Border */}
          <div className="h-14 border-t border-white/10" />
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;