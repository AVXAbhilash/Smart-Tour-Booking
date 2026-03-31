import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Globe, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email === 'admin' && formData.password === '1234') {
      localStorage.setItem('adminToken', 'secure-admin-token');
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl shadow-black/50">
        <div className="text-center mb-8">
          <div className="inline-flex bg-primary-500/10 p-4 rounded-2xl border border-primary-500/20 mb-4">
            <ShieldCheck className="text-primary-400" size={32} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Admin Portal</h2>
          <p className="text-slate-400 font-medium mt-2">Authorized personnel only.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Admin ID</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
              <input
                type="text"
                required
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
                placeholder="Enter Admin ID"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
              <input
                type="password"
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary-500/20 mt-6">
            Authenticate Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;