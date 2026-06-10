import { RotateCcw } from "lucide-react";

export default function CompletionScreen({ result, onReset }) {
  const avg = result?.summary?.average_score || 0;

  return (
    <div className="bg-slate-900 p-10 rounded-3xl text-center">
      <h1>Interview Complete</h1>
      <h2>Score: {avg}/10</h2>

      <p>{result?.summary?.feedback}</p>

      <button onClick={onReset} className="mt-6 bg-violet-600 px-6 py-3">
        <RotateCcw /> Retry
      </button>
    </div>
  );
}