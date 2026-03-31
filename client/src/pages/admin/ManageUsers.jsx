import React from 'react';
import AdminLayout from './AdminLayout';
import { Shield, ShieldAlert, Trash2 } from 'lucide-react';

const ManageUsers = () => {
  return (
    <AdminLayout title="Manage Users">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-xs uppercase tracking-widest text-slate-500 border-b border-slate-800">
                <th className="px-6 py-4 font-black">User</th>
                <th className="px-6 py-4 font-black">Email</th>
                <th className="px-6 py-4 font-black">Role</th>
                <th className="px-6 py-4 font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm font-medium text-slate-300">
              <tr className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4 font-bold text-white">John Doe</td>
                <td className="px-6 py-4 text-slate-400">john@example.com</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-md text-xs font-bold">
                    <Shield size={12} /> User
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4 font-bold text-white">Super Admin</td>
                <td className="px-6 py-4 text-slate-400">admin@briskode.com</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 bg-primary-500/10 text-primary-400 border border-primary-500/20 px-2.5 py-1 rounded-md text-xs font-bold">
                    <ShieldAlert size={12} /> Admin
                  </span>
                </td>
                <td className="px-6 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;