import { useState } from "react";
import axios from "axios";
import {
  Upload,
  FileText,
  Play,
  Loader2,
} from "lucide-react";

const BACKEND_URL = "http://localhost:8000";

export default function Interview() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const [question, setQuestion] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [dbSessionId, setDbSessionId] =
    useState("");

    const [answer, setAnswer] = useState("");
const [evaluation, setEvaluation] = useState("");
const [submitting, setSubmitting] = useState(false);

  const [isListening, setIsListening] = useState(false);


  const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

console.log("TOKEN:", localStorage.getItem("token"));

const startListening = () => {
  setIsListening(true);

  recognition.start();

  recognition.onresult = (event) => {
    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    setAnswer(transcript);
  };
};


const stopListening = () => {
  setIsListening(false);
  recognition.stop();
};

  const startInterview = async () => {
    if (!resume) {
      alert("Please upload resume");
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const formData = new FormData();

      formData.append("file", resume);

      const response = await axios.post(
        `${BACKEND_URL}/start-interview`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
            
          },
        }
      );

      setQuestion(
        response.data.first_question
      );

      setSessionId(
        response.data.session_id
      );

      setDbSessionId(
        response.data.db_session_id
      );
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.detail ||
          "Interview start failed"
      );
    } finally {
      setLoading(false);
    }
  };



  const submitAnswer = async () => {
  if (!answer.trim()) {
    alert("Please enter an answer");
    return;
  }

  try {
    setSubmitting(true);

    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${BACKEND_URL}/submit-answer`,
      {
        session_id: sessionId,
        db_session_id: dbSessionId,
        answer: answer,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
      }
    );

    const result = response.data;

    // Show AI evaluation
    if (result.evaluation) {
      setEvaluation(result.evaluation);
    }

    // Next question exists
    if (result.next_question) {
      setQuestion(result.next_question);

      // clear answer box
      setAnswer("");

      // speak next question
      try {
        await axios.post(
          `${BACKEND_URL}/ai-speak`,
          {
            text: result.next_question,
          }
        );
      } catch (err) {
        console.log("Voice error", err);
      }
    } else {
      alert("Interview Completed");
    }
  } catch (error) {
    console.log(error);
    alert("Failed to submit answer");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-4xl">
        {!question ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">
            <h1 className="text-4xl font-bold mb-3">
              AI Interview Coach
            </h1>

            <p className="text-slate-400 mb-10">
              Upload your resume and start
              an AI-powered mock interview.
            </p>

            {/* Upload Area */}
            <label className="border-2 border-dashed border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 transition">
              <Upload size={50} />

              <p className="mt-4">
                Click to upload resume
              </p>

              <p className="text-sm text-slate-500">
                PDF only
              </p>

              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) =>
                  setResume(
                    e.target.files[0]
                  )
                }
              />
            </label>

            {resume && (
              <div className="mt-5 flex items-center gap-3 bg-slate-800 p-4 rounded-xl">
                <FileText />
                <span>{resume.name}</span>
              </div>
            )}

            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full mt-8 bg-violet-600 hover:bg-violet-700 py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play />
                  Start Interview
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">
            <div className="flex justify-between mb-8">
              <h2 className="text-2xl font-bold">
                AI Interview Room
              </h2>

              <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
                Live
              </span>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl">
              <p className="text-slate-400 mb-2">
                Question 1
              </p>

              <h3 className="text-xl">
                {question}
              </h3>
            </div>

            {/* <div className="mt-8">
              <textarea
                    value={answer}
                    onChange={(e) =>
                        setAnswer(e.target.value)
                    }
                    placeholder="Type your answer..."
                    className="w-full h-40 bg-slate-800 rounded-xl p-4 outline-none"
                />
                {evaluation && (
                <div className="mt-6 bg-slate-800 p-5 rounded-xl">
                    <h4 className="font-semibold mb-2">
                    AI Feedback
                    </h4>

                    <p className="text-slate-300 whitespace-pre-wrap">
                    {evaluation}
                    </p>
                </div>
                )}
            </div> */}


            <div className="mt-8">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type or speak your answer..."
              className="w-full h-40 bg-slate-800 rounded-xl p-4 outline-none"
            />

            <div className="flex gap-4 mt-3">
              {!isListening ? (
                <button
                  onClick={startListening}
                  className="bg-green-600 px-4 py-2 rounded-lg"
                >
                  🎤 Start Speaking
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="bg-red-600 px-4 py-2 rounded-lg"
                >
                  ⏹ Stop
                </button>
              )}
            </div>
          </div>


            <button
                onClick={submitAnswer}
                disabled={submitting}
                className="mt-6 bg-violet-600 px-8 py-3 rounded-xl"
                >
                {submitting
                    ? "Submitting..."
                    : "Submit Answer"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}