import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../api/backend";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await login(formData.email, formData.password);
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch(err) {
      setError(err.response?.data?.detail || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Welcome Back</h1>
        <p className="text-gray-400 text-center mb-8">
          Login to continue your AI interview practice
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 active:bg-blue-800 disabled:opacity-60 rounded-lg text-white font-semibold transition-all duration-150"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-slate-700"></div>
          <span className="px-4 text-gray-400">OR</span>
          <div className="flex-1 h-px bg-slate-700"></div>
        </div>

        <button className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition">
          Continue with Google
        </button>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:text-blue-400">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
