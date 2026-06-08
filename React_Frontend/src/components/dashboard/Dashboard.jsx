import {
  Play,
  Clock,
  Trophy,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold">
            Welcome Back 👋
          </h1>

          <p className="text-gray-400 mt-2">
            Prepare, Practice and Ace your interviews
          </p>
        </div>

        <button className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 transition">
          Upgrade Pro
        </button>
      </div>

      {/* Start Interview Card */}
      <div className="bg-gradient-to-r from-violet-700 to-indigo-700 rounded-3xl p-8 mb-8 shadow-xl">
        <h2 className="text-3xl font-bold mb-3">
          AI Mock Interview
        </h2>

        <p className="text-violet-100 mb-6 max-w-xl">
          Practice with an AI interviewer and receive
          detailed feedback on communication,
          technical knowledge and confidence.
        </p>

        <button onClick={()=>navigate("/interview")} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
          <Play size={20} />
          Start Interview
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-violet-400" />
            <h3 className="font-semibold">
              Interviews Taken
            </h3>
          </div>

          <p className="text-3xl font-bold mt-4">
            24
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-400" />
            <h3 className="font-semibold">
              Average Score
            </h3>
          </div>

          <p className="text-3xl font-bold mt-4">
            82%
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <Clock className="text-green-400" />
            <h3 className="font-semibold">
              Practice Hours
            </h3>
          </div>

          <p className="text-3xl font-bold mt-4">
            12h
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Interviews */}
        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">
            Recent Interviews
          </h2>

          <div className="space-y-4">
            {[
              {
                role: "React Developer",
                score: "85%",
              },
              {
                role: "JavaScript",
                score: "78%",
              },
              {
                role: "HR Round",
                score: "90%",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-slate-700 pb-3"
              >
                <span>{item.role}</span>

                <span className="font-semibold text-green-400">
                  {item.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended */}
        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">
            Recommended Practice
          </h2>

          <div className="space-y-4">
            {[
              "React Hooks",
              "Redux",
              "System Design",
              "Behavioral Questions",
            ].map((topic) => (
              <div
                key={topic}
                className="flex justify-between items-center bg-slate-700 p-4 rounded-xl hover:bg-slate-600 transition cursor-pointer"
              >
                <span>{topic}</span>

                <ArrowRight />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}