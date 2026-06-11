import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Loader2,
  Trophy,
  FileQuestion,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BACKEND_URL = "http://localhost:8000";

function ScoreBadge({ score }) {
  const color =
    score >= 7 ? "text-green-400" : score >= 5 ? "text-yellow-400" : "text-red-400";
  const bg =
    score >= 7 ? "bg-green-400/10" : score >= 5 ? "bg-yellow-400/10" : "bg-red-400/10";
  return (
    <span className={`text-sm font-bold px-3 py-1 rounded-full ${color} ${bg}`}>
      {score}/10
    </span>
  );
}

function ScoreBar({ score }) {
  const pct = Math.round((score / 10) * 100);
  const color = score >= 7 ? "bg-green-500" : score >= 5 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-400 w-8 text-right">{score}/10</span>
    </div>
  );
}

export default function InterviewHistory() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [details, setDetails] = useState({}); // sessionId → detail data
  const [loadingDetail, setLoadingDetail] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    axios
      .get(`${BACKEND_URL}/my-interviews`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => setInterviews(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const completed = interviews.filter(
    (i) => i.score !== null && i.total_questions > 0
  );
  const sanitize = (s) =>
    s > 10 ? +(s / 10).toFixed(1) : +s;
  // Sequential numbering — latest = #N, oldest = #1
  const numbered = [...completed].map((item, idx) => ({
    ...item,
    displayNum: completed.length - idx, // reverse order so latest is highest
  }));

  const chartData = [...numbered].reverse().map((i) => ({
    date: `${new Date(i.completed_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        })} (#${i.displayNum})`,
    score: sanitize(i.score),
  }));

  const toggleExpand = async (sessionId) => {
    if (expandedId === sessionId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(sessionId);
    if (details[sessionId]) return; // already fetched

    setLoadingDetail(sessionId);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${BACKEND_URL}/interview-summary/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDetails((prev) => ({ ...prev, [sessionId]: data }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetail(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-violet-400" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-slate-400 hover:text-white transition flex items-center gap-1 text-sm"
        >
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div>
          <h1 className="text-3xl font-bold">Interview History</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {completed.length} completed session{completed.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {completed.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl p-10 text-center">
          <FileQuestion size={40} className="text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">No completed interviews yet</p>
          <button
            onClick={() => navigate("/interview")}
            className="mt-4 bg-violet-600 hover:bg-violet-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            Start your first interview →
          </button>
        </div>
      ) : (
        <>
          {/* Score Trend Chart */}
          {chartData.length > 1 && (
            <div className="bg-slate-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-violet-400" />
                <h2 className="font-semibold">Score Trend</h2>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  {/* <XAxis dataKey="name" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 11 }} /> */}
                  <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis domain={[0, 10]} stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9" }}
                    labelStyle={{ color: "#94a3b8" }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2.5}
                    dot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Interview Cards */}
          <div className="space-y-3">
            {numbered.map((item) => {
              const isOpen = expandedId === item.session_id;
              const detail = details[item.session_id];
              const isLoadingThis = loadingDetail === item.session_id;

              return (
                <div key={item.session_id} className="bg-slate-800 rounded-2xl overflow-hidden">
                  {/* Card header — click to expand */}
                  <button
                    onClick={() => toggleExpand(item.session_id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-slate-700/50 transition text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-400 font-bold text-sm">
                        #{item.displayNum}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Interview #{item.displayNum}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <FileQuestion size={11} /> {item.total_questions} questions
                          </span>
                          {item.completed_at && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <CalendarDays size={11} />
                              {new Date(item.completed_at).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric"
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ScoreBadge score={sanitize(item.score)} />
                      {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="border-t border-slate-700 px-5 pb-5 pt-4">
                      {isLoadingThis ? (
                        <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
                          <Loader2 size={14} className="animate-spin" /> Loading details…
                        </div>
                      ) : detail ? (
                        <div className="space-y-5">
                          {detail.questions.map((q, idx) => (
                            <div key={idx} className="bg-slate-900 rounded-xl p-4 space-y-3">
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                                  Q{idx + 1}. {q.question}
                                </p>
                                <span className="shrink-0">
                                  <ScoreBadge score={sanitize(q.score)} />
                                </span>
                              </div>
                              <ScoreBar score={sanitize(q.score)} />
                              <div className="bg-slate-800 rounded-lg p-3">
                                <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">Your Answer</p>
                                <p className="text-sm text-slate-300 leading-relaxed">{q.answer || "—"}</p>
                              </div>
                              <div className="bg-violet-950/40 border border-violet-800/40 rounded-lg p-3">
                                <p className="text-xs text-violet-400 mb-1 font-medium uppercase tracking-wide">AI Feedback</p>
                                <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{q.evaluation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}