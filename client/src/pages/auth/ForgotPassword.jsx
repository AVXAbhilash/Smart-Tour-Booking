import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, ShieldCheck, Globe } from "lucide-react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setLoading(true);

    try {
      // This route will need to be created on your backend!
      const { data } = await axios.post("http://localhost:5200/api/users/forgot-password", { email });
      
      setStatus({ type: "success", message: "Password reset link sent! Please check your email." });
      setEmail(""); // Clear the input
    } catch (err) {
      setStatus({ 
        type: "error", 
        message: err.response?.data?.message || "Something went wrong. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden p-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"
          alt="Travel Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>
      </div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="bg-primary-600 p-2 rounded-xl group-hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30">
              <Globe className="text-white" size={24} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              Booking<span className="text-primary-400">Tours</span>
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-primary-100/70">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* Status Messages */}
        {status.message && (
          <div className={`p-3 rounded-xl mb-6 text-sm text-center border flex items-center justify-center gap-2 ${
            status.type === 'success' 
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' 
              : 'bg-red-500/20 border-red-500/50 text-red-200'
          }`}>
            {status.type === 'success' && <ShieldCheck size={18} />}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-primary-100 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-primary-300" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-primary-200/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="you@example.com"
                disabled={loading || status.type === 'success'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || status.type === 'success'}
            className={`w-full ${loading || status.type === 'success' ? "bg-primary-500/50 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-700"} text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 mt-4`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 font-bold transition-colors"
          >
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;