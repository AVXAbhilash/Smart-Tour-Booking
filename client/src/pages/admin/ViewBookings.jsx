import React from 'react';
import AdminLayout from './AdminLayout';

const ViewBookings = () => {
  return (
    <AdminLayout title="View Bookings">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-xs uppercase tracking-widest text-slate-500 border-b border-slate-800">
                <th className="px-6 py-4 font-black">Booking ID</th>
                <th className="px-6 py-4 font-black">Customer</th>
                <th className="px-6 py-4 font-black">Tour</th>
                <th className="px-6 py-4 font-black">Status</th>
                <th className="px-6 py-4 font-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm font-medium text-slate-300">
              <tr className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4 text-slate-500">#BK-9021</td>
                <td className="px-6 py-4 text-white font-bold">Alex Johnson</td>
                <td className="px-6 py-4 text-slate-400">Swiss Alps Explorer</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md text-xs font-bold">Confirmed</span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-primary-400 hover:text-primary-300 font-bold text-xs uppercase tracking-wider">Details</button>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4 text-slate-500">#BK-9022</td>
                <td className="px-6 py-4 text-white font-bold">Maria Rodriguez</td>
                <td className="px-6 py-4 text-slate-400">Bali Beach Retreat</td>
                <td className="px-6 py-4">
                  <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded-md text-xs font-bold">Pending</span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-primary-400 hover:text-primary-300 font-bold text-xs uppercase tracking-wider">Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewBookings;