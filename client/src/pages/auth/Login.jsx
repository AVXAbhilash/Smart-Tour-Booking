import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Globe } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.email === 'Admin1' && formData.password === '1234') {
      navigate('/admin/dashboard');
    } else {
      // 1. Save the token to authenticate the user
      localStorage.setItem('userToken', 'fake-jwt-token-123');
      
      // 2. Redirect back to the HOME PAGE so they can now use all functions!
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden p-4">
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
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-primary-100/70">Enter your details to access your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-primary-100 mb-1">Email or Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-primary-300" />
              </div>
              <input
                type="text"
                name="email"
                required
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-primary-200/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="Admin1 or you@example.com" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-100 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-primary-300" />
              </div>
              <input
                type="password"
                name="password"
                required
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-primary-200/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="••••••••" 
              />
            </div>
            <div className="flex justify-end mt-2">
              <Link to="#" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">Forgot Password?</Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 mt-4"
          >
            Sign In <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center text-primary-100/70 mt-8 text-sm">
          Don't have an account? <Link to="/register" className="text-primary-400 hover:text-primary-300 font-bold transition-colors">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;