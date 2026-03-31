import React from 'react';
import { FileText } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-200 dark:border-slate-800 transition-colors">
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10 border-b border-gray-200 dark:border-slate-800 pb-8">
          <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-2xl text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800/50 shadow-sm">
            <FileText size={36} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Terms of Service</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Last Updated: March 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using the BookingBuddy platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using our application.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. User Responsibilities</h2>
            <p>You must be at least 18 years old to book a tour. You are solely responsible for maintaining the confidentiality of your account credentials and ensuring that all information provided during the checkout and booking process is accurate and up-to-date.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Booking & Payments</h2>
            <p>All tour prices displayed on the platform are subject to change until a booking is fully confirmed and paid for. We reserve the right to cancel any booking due to technical errors, pricing mistakes, or unforeseen vendor circumstances, in which case a full refund will be issued immediately.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Intellectual Property</h2>
            <p>All content on this website, including text, graphics, logos, user interfaces, and software, is the exclusive property of BookingBuddy and is protected by international copyright laws. Unauthorized reproduction or scraping is strictly prohibited.</p>
          </section>
        </div>

      </div>
    </div>
  );
};

export default TermsOfService;