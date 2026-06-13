import { Link,  useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../api/backend";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit =async (e) => {
    e.preventDefault(); 
    try{
      // console.log(formData);
      const res = await login(formData.email,formData.password);
      localStorage.setItem("token",res.data.access_token);
      // alert("login successful");
      navigate("/dashboard");
    }catch(err){
      console.log(err);
      alert("login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-xl">
        
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back
        </h1>

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

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:text-blue-400"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition"
          >
            Login
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
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:text-blue-400">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
