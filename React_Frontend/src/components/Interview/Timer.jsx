import { useEffect, useState } from "react";

export default function Timer({ startTime, limit = 120 }) {
  const [remaining, setRemaining] = useState(limit);

  useEffect(() => {
    setRemaining(limit);

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
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold ${
        isLow ? "bg-red-500/20 text-red-400" : "bg-slate-800 text-slate-200"
      }`}
    >
      ⏱ {mins}:{secs}
    </div>
  );
}