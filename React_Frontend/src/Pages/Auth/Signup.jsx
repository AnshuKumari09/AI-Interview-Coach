import { useState } from "react";
import { signup } from "../../api/backend";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      await signup(email, password);
      navigate("/login");
    } catch(err) {
      setError(err.response?.data?.detail || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Signup to start your AI Interview journey here
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 active:bg-blue-800 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-all duration-150 shadow-md"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
