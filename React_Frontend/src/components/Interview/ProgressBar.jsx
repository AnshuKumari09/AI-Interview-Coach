export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-slate-400 mb-2">
        <span>Question {current} of {total}</span>
        <span>{pct}%</span>
      </div>

      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}