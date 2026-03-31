import React from 'react';
import AdminLayout from './AdminLayout';
import { Star, Trash2 } from 'lucide-react';

const ManageReviews = () => {
  return (
    <AdminLayout title="Customer Reviews">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Review Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg relative group">
          <button className="absolute top-6 right-6 p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
            <Trash2 size={16} />
          </button>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
            ))}
          </div>
          <p className="text-slate-300 font-medium mb-4 leading-relaxed">
            "Absolutely incredible experience in the Swiss Alps. The tour guides were highly professional."
          </p>
          <div className="text-sm font-bold text-slate-500">
            <span className="text-white">Alex Johnson</span> • Swiss Alps Explorer
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default ManageReviews;