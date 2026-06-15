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
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (!storedToken) {
      setLoading(false);
      return;
    }

    axios
      .get(`${BACKEND_URL}/my-interviews`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then(({ data }) => {
        setInterviews(data);
      })
      .catch((err) => {
        console.error("Failed to fetch interviews:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const completed = interviews.filter(
    (i) => i.score !== null && i.total_questions > 0
  );

  const totalTaken = completed.length;

  const sanitize = (score) =>
    score > 10 ? +(score / 10).toFixed(1) : +score;

  const sanitizedScores = completed.map((i) => sanitize(i.score));

const avgScore =
  sanitizedScores.length > 0
    ? (
        sanitizedScores.reduce((a, b) => a + b, 0) /
        sanitizedScores.length
      ).toFixed(1)
    : "0";

const numberedCompleted = completed.map((item, idx) => ({
  ...item,
  displayNum: completed.length - idx,
}));

const recentThree = numberedCompleted.slice(0, 3);

if (loading) {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <Loader2 className="animate-spin w-10 h-10 text-violet-500" />
    </div>
  );
}
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
          <Loader2
            size={24}
            className="animate-spin text-slate-500"
          />
        ) : (
          value
        )}
      </p>
    </div>
  );
}

      {/* Hero Section */}
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
            token ? navigate("/interview") : navigate("/login")
          }
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
        >
          <Play size={20} />
          {token ? "Start Interview" : "Login to Start"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<BarChart3 className="text-violet-400" />}
          label="Interviews Taken"
          value={loading ? null : totalTaken}
        />

        <StatCard
          icon={<Trophy className="text-yellow-400" />}
          label="Average Score"
          value={
            loading
              ? null
              : avgScore !== null
              ? `${avgScore}/10`
              : "—"
          }
        />

        <StatCard
          icon={<Clock className="text-green-400" />}
          label="Practice Sessions"
          value={loading ? null : interviews.length}
        />
      </div>

      {/* Bottom section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Interviews */}
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">
              Recent Interviews
            </h2>

            {completed.length > 3 && (
              <button
                onClick={() => navigate("/history")}
                className="text-violet-400 text-sm hover:underline flex items-center gap-1"
              >
                View all <ArrowRight size={14} />
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Loader2 size={15} className="animate-spin" />
              Loading...
            </div>
          ) : recentThree.length === 0 ? (
            <p className="text-slate-400 text-sm">
              No completed interviews yet.
            </p>
          ) : (
            <div className="space-y-4">
              {recentThree.map((item) => (
                <div
                  key={item.session_id}
                  className="flex justify-between items-center border-b border-slate-700 pb-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      Interview #{item.displayNum}
                    </p>

                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.total_questions} questions
                      {item.completed_at
                        ? ` · ${new Date(
                            item.completed_at
                          ).toLocaleDateString()}`
                        : ""}
                    </p>
                  </div>

                  <span
                    className={`font-semibold text-sm ${
                      item.score >= 7
                        ? "text-green-400"
                        : item.score >= 5
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {item.score}/10
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="font-semibold">{label}</h3>
      </div>

      <p className="text-3xl font-bold mt-4">
        {value === null ? (
          <Loader2
            size={24}
            className="animate-spin text-slate-500"
          />
        ) : (
          value
        )}
      </p>
    </div>
  );
}

        {/* Recommended Practice */}
        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">
            Recommended Practice
          </h2>

          <div className="space-y-4">
            {[
              "React Hooks",
              "Redux",
              "System Design",
              "Behavioral Questions",
            ].map((topic) => (
              <div
                key={topic}
                onClick={() =>
                  token
                    ? navigate("/interview")
                    : navigate("/login")
                }
                className="flex justify-between items-center bg-slate-700 p-4 rounded-xl hover:bg-slate-600 transition cursor-pointer"
              >
                <span>{topic}</span>
                <ArrowRight />
              </div>
            ))}
          </div>
        </div>
      </div>
