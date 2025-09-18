import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import axios from "axios";
import app from "../firebase";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);

  const syncUserWithBackend = async (user, name) => {
    try {
      const token = await user.getIdToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/sync`,
        { uid: user.uid, email: user.email, name: name || user.displayName || "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("❌ User sync failed", err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPass) return alert("Please fill in all fields");
    if (password !== confirmPass) return alert("Passwords do not match");

    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      await syncUserWithBackend(user, username);
      alert("✅ Registration successful");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("❌ Registration failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      await syncUserWithBackend(user, user.displayName);
      alert("✅ Google signup/login successful");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("❌ Google signup failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 overflow-hidden px-4">
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="w-96 h-96 bg-pink-400/30 rounded-full blur-3xl absolute -top-40 -left-40 animate-pulse-slow"></div>
        <div className="w-72 h-72 bg-indigo-400/20 rounded-full blur-2xl absolute -bottom-32 -right-20 animate-pulse-slow"></div>
      </div>

      {/* Glassmorphic card */}
      <div className="relative bg-white/20 backdrop-blur-2xl shadow-xl rounded-3xl w-full max-w-md p-10 border border-white/30 hover:shadow-2xl transition-transform transform hover:scale-105">
        <h2 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg">
          Create Account 🚀
        </h2>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="yourname123"
              className="w-full px-5 py-3 rounded-xl border border-white/40 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition shadow-md"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-5 py-3 rounded-xl border border-white/40 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition shadow-md"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-5 py-3 pr-12 rounded-xl border border-white/40 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition shadow-md"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 cursor-pointer hover:text-white transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-5 py-3 pr-12 rounded-xl border border-white/40 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition shadow-md"
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 cursor-pointer hover:text-white transition"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Register button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Google signup */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full mt-3 flex items-center justify-center gap-3 bg-white/20 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-6 h-6" />
            {loading ? "Please wait..." : "Sign up with Google"}
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-white/80 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-400 font-medium hover:underline hover:text-pink-300 transition">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
