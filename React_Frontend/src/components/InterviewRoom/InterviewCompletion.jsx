import React from "react";
import { RotateCcw, Sparkles } from "lucide-react";

// ─── Performance tier logic ───────────────────────────────────────────────
function getTier(avg) {
  if (avg >= 8) {
    return {
      emoji: "🌟",
      title: "Outstanding Performance!",
      msg: "You demonstrated strong technical knowledge. You're well prepared for real interviews. Keep it up! 🚀",
      ring: "border-green-500/40",
      glow: "bg-green-500/10",
      text: "text-green-300",
    };
  }
  if (avg >= 5) {
    return {
      emoji: "💪",
      title: "Good Effort!",
      msg: "You have a solid foundation. Focus on explaining concepts more clearly and precisely. Practice daily! 🎯",
      ring: "border-blue-500/40",
      glow: "bg-blue-500/10",
      text: "text-blue-300",
    };
  }
  return {
    emoji: "🌱",
    title: "Keep Practicing!",
    msg: "Every expert was once a beginner. Review the correct answers and practice again. Consistency is key! 💡",
    ring: "border-amber-500/40",
    glow: "bg-amber-500/10",
    text: "text-amber-300",
  };
}

// ─── InterviewCompletion ───────────────────────────────────────────────────
// Props:
//   result  -> final response object from /submit-answer
//              (the call where `next_question` was absent and `summary` was present)
//   onRetry -> reset / navigate back to setup
export default function InterviewCompletion({ result, onRetry }) {
  const summary = result?.summary;
  const avg = summary?.average_score ?? 0;
  const tier = getTier(avg);

  return (
    <div className="h-screen w-full bg-[#09091B] text-white overflow-y-auto">
      {/* Top gradient border — matches InterviewRoom */}
      <div className="h-[4px] w-full bg-gradient-to-r from-violet-600 via-blue-600 to-violet-600" />

      <div className="min-h-[calc(100vh-4px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <div className="bg-[#11112A] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-violet-500/20 border border-violet-500 flex items-center justify-center">
                <Sparkles size={24} className="text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold">Interview Complete!</h2>
              <p className="text-gray-400 text-sm">Great job finishing the session.</p>
            </div>

            {/* Score stats */}
            {summary && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1A1A35] border border-white/5 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-violet-400">
                    {summary.average_score ?? "—"}
                    <span className="text-base text-gray-500">/10</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Average Score</p>
                </div>
                <div className="bg-[#1A1A35] border border-white/5 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-violet-400">{summary.total_questions}</p>
                  <p className="text-xs text-gray-400 mt-1">Questions Answered</p>
                </div>
              </div>
            )}

            {/* Tier message */}
            <div className={`border ${tier.ring} ${tier.glow} rounded-xl p-5`}>
              <p className={`font-semibold text-lg mb-1 ${tier.text}`}>
                {tier.emoji} {tier.title}
              </p>
              <p className="text-sm leading-relaxed text-gray-300">{tier.msg}</p>
            </div>

            {/* Optional backend feedback text */}
            {summary?.feedback && (
              <p className="text-gray-400 text-sm text-center">{summary.feedback}</p>
            )}

            {/* Optional per-question breakdown, only if backend sends it */}
            {Array.isArray(summary?.question_scores) && summary.question_scores.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Question Breakdown
                </p>
                {summary.question_scores.map((q, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-[#1A1A35] border border-white/5 rounded-lg px-4 py-2 text-sm"
                  >
                    <span className="text-gray-300 truncate pr-2">
                      {q.question || `Question ${i + 1}`}
                    </span>
                    <span className="text-violet-400 font-semibold shrink-0">
                      {q.score}/10
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 py-3 rounded-xl font-semibold transition-colors"
            >
              <RotateCcw size={16} /> Practice Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}