import React from 'react';
import { AlertCircle } from 'lucide-react';

const CancellationPolicy = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-200 dark:border-slate-800 transition-colors">
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10 border-b border-gray-200 dark:border-slate-800 pb-8">
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-2xl text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/50 shadow-sm">
            <AlertCircle size={36} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Cancellation Policy</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Standard Booking Rules & Refunds</p>
          </div>
        </div>

        <div className="space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          
          <div className="bg-primary-50 dark:bg-slate-800/50 border border-primary-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">The Short Version:</h3>
            <p>Cancel up to 7 days before your tour for a 100% refund. Cancellations made closer to the date incur vendor penalties to cover pre-booked accommodations.</p>
          </div>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Standard Cancellation Timeline</h2>
            <ul className="list-disc pl-5 space-y-3 marker:text-primary-500">
              <li><strong className="text-slate-800 dark:text-slate-200">7+ Days Prior:</strong> Full 100% refund to your original payment method.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">3 to 6 Days Prior:</strong> 50% refund. The remaining 50% covers non-refundable bookings made on your behalf.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Less than 48 Hours:</strong> No refund possible.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">No-Shows:</strong> If you fail to arrive at the designated meeting point on time, no refunds will be issued under any circumstances.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Weather & Force Majeure</h2>
            <p>If BookingBuddy is forced to cancel a trip due to severe weather, natural disasters, or other unforeseeable safety hazards ("Force Majeure"), you will be offered the choice of a full 100% refund to your original payment method or a free reschedule to a future date.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">How to Cancel</h2>
            <p>To initiate a cancellation, please log into your account, navigate to the <strong>"My Bookings"</strong> tab, and click the <strong>"Cancel"</strong> button next to your active tour. Alternatively, you can contact our dedicated support team at support@bookingbuddy.com.</p>
          </section>
        </div>

      </div>
    </div>
  );
};

export default CancellationPolicy;