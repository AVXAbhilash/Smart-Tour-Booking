import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Lock, ArrowRight, CheckCircle, Globe, Loader, AlertCircle } from "lucide-react";
import axios from "axios";

function ResetPassword() {
  const { token } = useParams(); // Grabs the token from the URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (password !== confirmPassword) {
      return setStatus({ type: "error", message: "Passwords do not match." });
    }

    if (password.length < 6) {
      return setStatus({ type: "error", message: "Password must be at least 6 characters." });
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // Hits the route: PUT /api/users/reset-password/:token
      const { data } = await axios.put(`http://localhost:5200/api/users/reset-password/${token}`, {
        password,
      });

      setStatus({ type: "success", message: data.message });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Invalid or expired token. Please request a new link.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden p-4">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"
          alt="Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>
      </div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6 group">
            <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-500/30">
              <Globe className="text-white" size={24} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              Booking<span className="text-primary-400">Tours</span>
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">New Password</h2>
          <p className="text-primary-100/70">
            Secure your account by choosing a strong password.
          </p>
        </div>

        {/* Status Alerts */}
        {status.message && (
          <div className={`p-4 rounded-xl mb-6 text-sm flex items-center gap-3 border ${
            status.type === "success" 
            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200" 
            : "bg-red-500/20 border-red-500/50 text-red-200"
          }`}>
            {status.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {status.message}
          </div>
        )}

        {status.type !== "success" ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-primary-100 mb-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-primary-300" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-100 mb-1">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-primary-300" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg ${
                loading ? "bg-primary-500/50" : "bg-primary-600 hover:bg-primary-700 shadow-primary-500/30"
              }`}
            >
              {loading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <>Reset Password <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        ) : (
          <Link
            to="/login"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
          >
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;