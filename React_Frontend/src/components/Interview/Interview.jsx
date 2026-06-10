import { useState } from "react";
import SetupScreen from "./SetUpScreen";
import InterviewScreen from "./InterviewScreen";
import CompletionScreen from "./CompleteScreen";
import { speakAsync, startInterview, startInterviewQBank, submitAnswer } from "../../api/backend";
export default function Interview() {
  const [phase, setPhase] = useState("setup");

  const [sessionId, setSessionId] = useState("");
  const [question, setQuestion] = useState("");
  const [questionNum, setQuestionNum] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);

  const [evaluation, setEvaluation] = useState("");
  const [pendingNext, setPendingNext] = useState("");
  const [finalResult, setFinalResult] = useState(null);

  const token = localStorage.getItem("token");

  // START
  const handleStart = async (data) => {
    let res;

    if (data.mode === "qbank") {
      res = await startInterviewQBank(data, token);
    } else {
      res = await startInterview(data, token);
    }

    setSessionId(res.session_id);
    setQuestion(res.first_question);
    setTotalQuestions(res.total_questions || data.numQuestions);
    setPhase("interview");

    speakAsync(res.first_question);
  };

  // SUBMIT
  const handleSubmit = async (answer) => {
    const res = await submitAnswer(
      {
        session_id: sessionId,
        answer,
      },
      token
    );

    setEvaluation(res.evaluation);

    if (res.next_question) {
      setPendingNext(res.next_question);
    } else {
      setFinalResult(res);
      setPhase("done");
    }
  };

  // NEXT
  const handleNext = () => {
    setQuestion(pendingNext);
    setQuestionNum((p) => p + 1);
    setPendingNext("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {phase === "setup" && (
        <SetupScreen onStart={handleStart} />
      )}

      {phase === "interview" && (
        <InterviewScreen
          question={question}
          questionNum={questionNum}
          totalQuestions={totalQuestions}
          onSubmit={handleSubmit}
          evaluation={evaluation}
          pendingNext={pendingNext}
          onNextQuestion={handleNext}
        />
      )}

      {phase === "done" && (
        <CompletionScreen
          result={finalResult}
          onReset={() => setPhase("setup")}
        />
      )}
    </div>
  );
}