import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import axios from "axios";
import "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("token", token);
        await syncUserWithBackend(user);
        navigate("/dashboard");
      }
    });
    return () => unsubscribe();
  }, []);

  const syncUserWithBackend = async (user) => {
    try {
      const token = await user.getIdToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/sync`,
        {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("User sync failed", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      alert("Please fill in all fields");
      setLoading(false);
      return;
    }
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      await syncUserWithBackend(user);
      alert("✅ Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("❌ Login failed: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      await syncUserWithBackend(user);
      alert("✅ Google login successful");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("❌ Google login failed: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="w-96 h-96 bg-pink-400/30 rounded-full blur-3xl absolute -top-40 -left-40 animate-pulse-slow"></div>
        <div className="w-72 h-72 bg-indigo-400/20 rounded-full blur-2xl absolute -bottom-32 -right-20 animate-pulse-slow"></div>
      </div>

      {/* Glassmorphic login card */}
      <div className="relative bg-white/20 backdrop-blur-2xl shadow-xl rounded-3xl w-full max-w-md p-10 border border-white/30 hover:shadow-2xl transition-transform transform hover:scale-105">
        <h2 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-5 py-3 rounded-xl border border-white/40 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition shadow-md"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
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

          {/* Sign In button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Google login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mt-3 flex items-center justify-center gap-3 bg-white/20 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-6 h-6"
            />
            {loading ? "Please wait..." : "Sign in with Google"}
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-white/80 mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-pink-400 font-medium hover:underline hover:text-pink-300 transition"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
