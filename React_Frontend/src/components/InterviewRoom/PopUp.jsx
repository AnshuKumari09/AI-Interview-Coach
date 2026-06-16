import React from "react";
import { Trophy, RotateCcw, Plus, X } from "lucide-react";

const Popup = ({
  isOpen,
  onClose,
  onPracticeAgain,
  onNewInterview,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-[500px] bg-[#11112A] border border-violet-500/30 rounded-2xl p-8 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-violet-500/20 flex items-center justify-center mb-5">
            <Trophy className="text-yellow-400" size={40} />
          </div>

          <h2 className="text-3xl font-bold text-white">
            Interview Completed 🎉
          </h2>

          <p className="text-gray-400 mt-3">
            Great job! You've completed all interview questions.
            Keep practicing to improve your confidence and
            communication skills.
          </p>

          <div className="flex gap-4 mt-8 w-full">
            <button
              onClick={onPracticeAgain}
              className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 py-3 rounded-xl font-semibold"
            >
              <RotateCcw size={18} />
              Practice Again
            </button>

            <button
              onClick={onNewInterview}
              className="flex-1 flex items-center justify-center gap-2 border border-white/10 hover:bg-white/5 py-3 rounded-xl font-semibold"
            >
              <Plus size={18} />
              New Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;