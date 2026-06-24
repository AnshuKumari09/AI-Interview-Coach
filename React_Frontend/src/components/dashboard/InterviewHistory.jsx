import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Loader2,
  FileQuestion,
  CalendarDays,
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

/* ---------------------------------------------------------------------
   Design language: "Transcript" — your interview history read like a
   personal record, not a dashboard. Serif for headings (the record's
   voice), monospace for every score (a ledger of numbers), and a
   vertical rail connecting sessions in time. Amber marks the standout
   score; everything else stays quiet ink and parchment.
---------------------------------------------------------------------- */

function band(score) {
  if (score >= 7.5) return { label: "Strong", ring: "#86A789", text: "#9BBE9E", bg: "rgb(86, 212, 208)" };
  if (score >= 5) return { label: "Solid", ring: "#D4A24C", text: "#D4A24C", bg: "rgba(45, 55, 145, 0.58)" };
  return { label: "Needs work", ring: "#C1666B", text: "#D38A8F", bg: "rgba(193,102,107,0.12)" };
}

function ScoreLedger({ score, size = "md" }) {
  const b = band(score);
  const dims = size === "sm" ? "text-2xl px-3.5 py-1.5" : "text-sm px-2.5 py-1";
  return (
    <span
      className={`font-mono tabular-nums tracking-tight rounded-md border ${dims}`}
      style={{ color: b.text, background: b.bg, borderColor: `${b.ring}40` }}
    >
      {score.toFixed(1)}<span className="opacity-50">/10</span>
    </span>
  );
}

function ScoreBar({ score }) {
  const b = band(score);
  const pct = Math.max(2, Math.round((score / 10) * 100));
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-[3px] bg-[#1E2740] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: b.ring }} />
      </div>
      <span className="font-mono text-[11px] tabular-nums w-10 text-right" style={{ color: b.text }}>
        {score.toFixed(1)}
      </span>
    </div>
  );
}

export default function InterviewHistory() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [details, setDetails] = useState({});
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
  const sanitize = (s) => (s > 10 ? +(s / 10).toFixed(1) : +s);

  const numbered = [...completed].map((item, idx) => ({
    ...item,
    displayNum: completed.length - idx,
  }));

  const scores = numbered.map((i) => sanitize(i.score));
  const best = scores.length ? Math.max(...scores) : null;
  const avg = scores.length
    ? +(scores.reduce((a, b2) => a + b2, 0) / scores.length).toFixed(1)
    : null;
  const trend =
    scores.length > 1 ? +(scores[0] - scores[scores.length - 1]).toFixed(1) : null;

  const chartData = [...numbered].reverse().map((i) => ({
    date: new Date(i.completed_at).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
    num: i.displayNum,
    score: sanitize(i.score),
  }));

  const selectSession = async (sessionId) => {
    setSelectedId(sessionId);
    if (details[sessionId]) return;

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

  // Auto-select the most recent session once the list loads
  useEffect(() => {
    if (!loading && completed.length > 0 && selectedId === null) {
      selectSession(numbered[0].session_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, completed.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D4A24C]" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-[#E8E6DF] bg-black">
       <div className="absolute right-[0%] top-[-10%] w-[500px] h-[500px] bg-[#6C04A7] rounded-full blur-[200px] opacity-60" />
         <div className="absolute right-[30%] top-[0%] w-[500px] h-[500px] bg-[#6C04A7] rounded-full blur-[200px] opacity-60" />
         <div className="absolute right-[60%] top-[0%] w-[500px] h-[500px] bg-[#6C04A7] rounded-full blur-[200px] opacity-60" />
         <div className="absolute right-[80%] top-[0%] w-[500px] h-[500px] bg-[#6C04A7] rounded-full blur-[200px] opacity-60" />
            
      <div className="max-w-10xl mx-auto px-6 py-5">
        {/* Header */}
         <button
         type="button"
              onClick={() => navigate("/")}
              className="relative z-10 text-[#8A93A8] hover:text-[#E8E6DF] cursor-pointer py-1 px-2 rounded-md transition flex items-center gap-1.5 text-lg mb-4 font-medium"
            >
              <ArrowLeft size={20} /> Dashboard
            </button>
        <div className="flex items-center justify-center mb-10">
          <div >
            <h1
              className="text-[4.1rem] font-bold leading-tight "
              style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
            >
              Your interview record
            </h1>
            <p className="text-green-500 font-bold text-md mt-1.5">
              {completed.length} completed session{completed.length !== 1 ? "s" : ""}
              {completed.length > 0 && " · scored and annotated"}
            </p>
          </div>
        </div>

        {completed.length === 0 ? (
          <div className="border border-[#1E2740] rounded-2xl bg-[#0E1626] sticky top-10 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-black">
            <FileQuestion size={32} className="text-[#3A4560] mx-auto mb-4" />
            <p className="text-[#E8E6DF] font-medium">No completed interviews yet</p>
            <p className="text-[#8A93A8] text-sm mt-1 mb-5">
              Your record starts after you finish your first session.
            </p>
            <button
              onClick={() => navigate("/interview")}
              className="bg-[#D4A24C] hover:bg-[#C39239] text-[#0B1220] px-5 py-2.5 rounded-lg text-sm font-semibold transition"
            >
              Start your first interview →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[600px_1fr] gap-6 items-start">
            {/* LEFT — all sessions */}
            <div className="space-y-6">
              {/* Summary strip */}
              <div className="grid grid-cols-3 gap-px bg-gray-600 rounded-2xl overflow-hidden border border-gray-600">
                <div className="bg-[#0E1626] px-3.5 py-3.5">
                  <p className="text-[15px] uppercase tracking-wider text-white font-medium mb-1">
                    Best
                  </p>
                  <p className="font-mono text-base tabular-nums" style={{ color: "#9BBE9E" }}>
                    {best?.toFixed(1)}
                  </p>
                </div>
                <div className="bg-[#0E1626] px-3.5 py-3.5">
                  <p className="text-[15px] uppercase tracking-wider text-white font-medium mb-1">
                    Average
                  </p>
                  <p className="font-mono text-base tabular-nums text-[#E8E6DF]">{avg?.toFixed(1)}</p>
                </div>
                <div className="bg-[#0E1626] px-3.5 py-3.5">
                  <p className="text-[15px] uppercase tracking-wider text-white font-medium mb-1">
                    Trend
                  </p>
                  <p
                    className="font-mono text-base tabular-nums"
                    style={{ color: trend == null ? "#E8E6DF" : trend > 0 ? "#9BBE9E" : trend < 0 ? "#D38A8F" : "#E8E6DF" }}
                  >
                    {trend == null ? "—" : `${trend > 0 ? "+" : ""}${trend.toFixed(1)}`}
                  </p>
                </div>
              </div>

              {/* Score trend chart */}
              {chartData.length > 1 && (
                <div className="border border-[#1E2740] rounded-2xl p-5 bg-[#0E1626]">
                  <h2
                    className="text-lg mb-3 text-gray-200 font-bold"
                    style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
                  >
                    Score over time
                  </h2>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <XAxis
                        dataKey="date"
                        stroke="#8ba2e2"
                        tick={{ fill: "#bec9e7", fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        domain={[0, 10]}
                        stroke="#1E2740"
                        tick={{ fill: "#a9b3d0", fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        width={20}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#3d0f47",
                          border: "1px solid #30063e",
                          borderRadius: 8,
                          color: "#E8E6DF",
                          fontSize: 15,
                        }}
                        labelFormatter={(label, p) => `#${p?.[0]?.payload?.num ?? ""} · ${label}`}
                        labelStyle={{ color: "#8A93A8" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#D4A24C"
                        strokeWidth={2}
                        dot={{ r: 6, fill: "#D4A24C", strokeWidth: 0 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Session list with timeline rail */}
              <div className="relative">
                <div className="absolute left-[13px] top-2 bottom-2 w-px bg-[#1E2740]" />
                <div className="space-y-2">
                  {numbered.map((item) => {
                    const isSelected = selectedId === item.session_id;
                    const s = sanitize(item.score);
                    const b = band(s);

                    return (
                      <div key={item.session_id} className="relative pl-8">
                        <div
                          className="absolute left-2 top-[18px] w-[9px] h-[9px] rounded-full border-2 bg-white"
                          style={{ borderColor: b.ring }}
                        />
                        <button
                          onClick={() => selectSession(item.session_id)}
                          className="w-full text-left rounded-xl px-4 py-3 transition border"
                          style={
                            isSelected
                              ? { background: "#220e38", borderColor: "#78716440" }
                              : { background: "#081230", borderColor: "#1E2740" }
                          }
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-md text-white">
                              Session #{item.displayNum}
                            </p>
                            <ScoreLedger score={s} />
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[15px] text-[#5C6786] flex items-center gap-1">
                              <FileQuestion size={15} /> {item.total_questions} questions
                            </span>
                            {item.completed_at && (
                              <span className="text-[15px] text-[#5C6786] flex items-center gap-1">
                                <CalendarDays size={15} />
                                {new Date(item.completed_at).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT — conversation for the selected session */}
            <div className="border border-gray-600 rounded-2xl bg-black/10 sticky top-10 h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
              {(() => {
                if (!selectedId) {
                  return (
                    <div className="p-12 text-center">
                      <FileQuestion size={28} className="text-[#3A4560] mx-auto mb-3" />
                      <p className="text-[#8A93A8] text-sm">Select a session to read its conversation</p>
                    </div>
                  );
                }
                const item = numbered.find((i) => i.session_id === selectedId);
                const detail = details[selectedId];
                const isLoadingThis = loadingDetail === selectedId;
                const s = item ? sanitize(item.score) : null;

                return (
                  <div className="flex flex-col h-full">
                    {/* Panel header — stays fixed at top, does not scroll */}
                    <div className="flex items-start justify-between gap-3 p-6 border-b border-[#1E2740] shrink-0">
                      <div>
                        <h2
                          className="text-2xl font-bold"
                          style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
                        >
                          Session #{item?.displayNum}
                        </h2>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-md text-[#5C6786] flex items-center gap-1">
                            <FileQuestion size={15} /> {item?.total_questions} questions
                          </span>
                          {item?.completed_at && (
                            <span className="text-md text-[#5C6786] flex items-center gap-1">
                              <CalendarDays size={15} />
                              {new Date(item.completed_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                      {s != null && <ScoreLedger score={s} size="lg" />}
                    </div>

                    {/* Conversation — only this part scrolls */}
                    <div className="p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-black">
                      {isLoadingThis ? (
                        <div className="flex  items-center gap-2 text-[#5C6786] text-md py-8 justify-center">
                          <Loader2 size={14} className="animate-spin" /> Loading conversation…
                        </div>
                      ) : detail ? (
                        <div className="space-y-5">
                          {detail.questions.map((q, idx) => {
                            const qs = sanitize(q.score);
                            return (
                              <div
                                key={idx}
                                className="bg-black/20 border border-[#1E2740] rounded-xl p-4 space-y-3"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <p className="text-lg font-medium text-[#E8E6DF] leading-relaxed">
                                    <span className=" text-lg text-gray-400 font-mono mr-1.5">
                                      Q{idx + 1}
                                    </span>
                                    {q.question}
                                  </p>
                                  <span className="shrink-0">
                                    <ScoreLedger score={qs} />
                                  </span>
                                </div>
                                <ScoreBar score={qs} />
                                <div className="bg-[#141B2E] rounded-lg p-3">
                                  <p className="text-[13px] text-gray-300 mb-1 font-medium uppercase tracking-wider">
                                    Your answer
                                  </p>
                                  <p className="text-md text-pink-200 leading-relaxed">
                                    {q.answer || "—"}
                                  </p>
                                </div>
                                <div
                                  className="rounded-lg p-3 border"
                                  style={{ background: "rgba(212,162,76,0.06)", borderColor: "rgba(212,162,76,0.18)" }}
                                >
                                  <p className="text-[13px] mb-1 font-lg uppercase tracking-wider" style={{ color: "#D4A24C" }}>
                                    Feedback
                                  </p>
                                  <p className="text-md text-[#C7CCDB] whitespace-pre-wrap leading-relaxed">
                                    {q.evaluation}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}