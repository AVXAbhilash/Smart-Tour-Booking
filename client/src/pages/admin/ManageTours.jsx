import React from 'react';
import AdminLayout from './AdminLayout';
import { Plus, Edit, Trash2 } from 'lucide-react';

const ManageTours = () => {
  return (
    <AdminLayout title="Manage Tours">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="font-bold text-lg text-white">Active Tour Packages</h3>
          <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg font-bold transition-colors">
            <Plus size={18} /> Add New Tour
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-xs uppercase tracking-widest text-slate-500 border-b border-slate-800">
                <th className="px-6 py-4 font-black">Tour Name</th>
                <th className="px-6 py-4 font-black">Location</th>
                <th className="px-6 py-4 font-black">Price</th>
                <th className="px-6 py-4 font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm font-medium text-slate-300">
              <tr className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4 font-bold text-white">Swiss Alps Explorer</td>
                <td className="px-6 py-4 text-slate-400">Switzerland</td>
                <td className="px-6 py-4">$1,299</td>
                <td className="px-6 py-4 flex gap-3">
                  <button className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"><Edit size={16} /></button>
                  <button className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4 font-bold text-white">Bali Beach Retreat</td>
                <td className="px-6 py-4 text-slate-400">Indonesia</td>
                <td className="px-6 py-4">$849</td>
                <td className="px-6 py-4 flex gap-3">
                  <button className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"><Edit size={16} /></button>
                  <button className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageTours;