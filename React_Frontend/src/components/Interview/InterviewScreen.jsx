import { useState, useEffect, useRef } from "react";

import { speakAsync } from "../../api/backend";
import Timer from "./Timer";
import ProgressBar from "./ProgressBar";
export default function InterviewScreen({
  question,
  questionNum,
  totalQuestions,
  timerStart,
  onSubmit,
  evaluation,
  pendingNext,
  onNextQuestion,
  isFollowup,
  submitting,
}) {
  const [answer, setAnswer] = useState("");

  const cleanQuestion = question?.replace(/^[Qq]?\d+[\.\)]\s*/, "");

  useEffect(() => {
    setAnswer("");
  }, [question]);

  return (
    <div className="bg-slate-900 p-10 rounded-3xl">
      <div className="flex justify-between">
        <h2>Interview Room</h2>
        <Timer startTime={timerStart} />
      </div>

      <ProgressBar current={questionNum} total={totalQuestions} />

      {/* Question */}
      <div className="bg-slate-800 p-5 rounded-xl">
        <p>{cleanQuestion}</p>
        <button onClick={() => speakAsync(question)}>🔊 Speak</button>
      </div>

      {/* Feedback */}
      {evaluation && pendingNext && (
        <div className="mt-4 bg-slate-800 p-4 rounded-xl">
          <p>{evaluation}</p>
          <button onClick={onNextQuestion}>Next</button>
        </div>
      )}

      {/* Answer */}
      {!pendingNext && (
        <>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full mt-4 p-3"
          />

          <button
            onClick={() => onSubmit(answer)}
            disabled={submitting}
            className="mt-3 bg-violet-600 px-5 py-2"
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
}