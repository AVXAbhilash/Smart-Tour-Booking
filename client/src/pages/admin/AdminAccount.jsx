import React from 'react';
import AdminLayout from './AdminLayout';
import { Camera, ShieldCheck, Mail, Lock, User } from 'lucide-react';

const AdminAccount = () => {
  return (
    <AdminLayout title="My Profile">
      <div className="max-w-4xl">
        
        {/* Profile Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary-600/10 blur-3xl rounded-full pointer-events-none"></div>

          <div className="relative group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250" 
              alt="Admin Avatar" 
              className="w-32 h-32 rounded-full object-cover border-4 border-slate-800 shadow-2xl transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Camera className="text-white" size={28} />
            </div>
          </div>

          <div className="text-center md:text-left z-10">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Super Admin</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 font-medium mb-4">
              <Mail size={16} /> admin@briskode.com
            </div>
            <span className="inline-flex items-center gap-1.5 bg-primary-500/10 text-primary-400 border border-primary-500/20 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
              <ShieldCheck size={16} /> Full System Access
            </span>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl p-8">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <User className="text-primary-400" size={20} /> Update Credentials
          </h3>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Display Name</label>
                <input 
                  type="text" 
                  defaultValue="Super Admin" 
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all" 
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="admin@briskode.com" 
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all" 
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/50 mt-6">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                <Lock className="text-primary-400" size={20} /> Security
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Current Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">New Password</label>
                  <input 
                    type="password" 
                    placeholder="Leave blank to keep current" 
                    className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all" 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminAccount;