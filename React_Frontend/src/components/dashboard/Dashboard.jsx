import { useEffect, useState } from "react";
import {
  Play,
  Clock,
  Trophy,
  BarChart3,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = "https://ai-interview-coach-0mp0.onrender.com";

export default function Dashboard() {
  const navigate = useNavigate();
const [interviews, setInterviews] = useState([]);
const [loading, setLoading] = useState(true);
const [token, setToken] = useState(
  localStorage.getItem("token")
);

const handleLogout = () => {
  localStorage.removeItem("token");
  setToken(null);
  navigate("/login");
};
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    axios
      .get(`${BACKEND_URL}/my-interviews`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => setInterviews(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────
const completed = interviews.filter(
  (i) => i.score !== null && i.total_questions > 0
);

const totalTaken = completed.length;

const sanitize = (s) => (s > 10 ? +(s / 10).toFixed(1) : +s);

const sanitizedScores = completed.map((i) => sanitize(i.score));

const sanitizedAvg =
  sanitizedScores.length > 0
    ? (
        sanitizedScores.reduce((a, b) => a + b, 0) /
        sanitizedScores.length
      ).toFixed(1)
    : null;

const avgScore = sanitizedAvg;

const numberedCompleted = completed.map((item, idx) => ({
  ...item,
  displayNum: completed.length - idx,
}));

const recentThree = numberedCompleted.slice(0, 3);


  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-8">
 {/* Header */}
<div className="flex justify-between items-center mb-10">
  <div>
    <h1 className="text-4xl font-bold">
      {token ? "Welcome Back 👋" : "AI Interview Coach 🚀"}
    </h1>

    <p className="text-gray-400 mt-2">
      {token
        ? "Prepare, Practice and Ace your interviews"
        : "Practice AI-powered mock interviews and improve your confidence"}
    </p>
  </div>

  <div className="flex items-center gap-3">
    {token ? (
      <button
        onClick={handleLogout}
        className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition"
      >
        Logout
      </button>
    ) : (
      <>
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-3 rounded-xl border border-violet-500 text-violet-400 hover:bg-violet-900 transition"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 transition"
        >
          Sign Up
        </button>
      </>
    )}
  </div>
</div>
{/* Hero Card */}
<div className="bg-gradient-to-r from-violet-700 to-indigo-700 rounded-3xl p-8 mb-8 shadow-xl">
  <h2 className="text-3xl font-bold mb-3">
    AI Mock Interview
  </h2>

  <p className="text-violet-100 mb-6 max-w-xl">
    Practice with an AI interviewer and receive detailed feedback on
    communication, technical knowledge, problem-solving and confidence.
  </p>

  <button
    onClick={() =>
      token
        ? navigate("/interview")
        : navigate("/login")
    }
    className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
  >
    <Play size={20} />
    {token ? "Start Interview" : "Login to Start"}
  </button>
</div>

        {/* Recommended Practice */}
        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">Recommended Practice</h2>
          <div className="space-y-4">
            {[
              "React Hooks",
              "Redux",
              "System Design",
              "Behavioral Questions",
            ].map((topic) => (
              <div
                key={topic}
                onClick={() => navigate("/interview")}
                className="flex justify-between items-center bg-slate-700 p-4 rounded-xl hover:bg-slate-600 transition cursor-pointer"
              >
                <span>{topic}</span>
                <ArrowRight />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Small helper component ───────────────────────────────────────────────────
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="font-semibold">{label}</h3>
      </div>
      <p className="text-3xl font-bold mt-4">
        {value === null ? (
          <Loader2 size={24} className="animate-spin text-slate-500" />
        ) : (
          value
        )}
      </p>
    </div>
  );
}
