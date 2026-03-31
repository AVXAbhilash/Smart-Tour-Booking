import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-200 dark:border-slate-800 transition-colors">
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10 border-b border-gray-200 dark:border-slate-800 pb-8">
          <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-2xl text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800/50 shadow-sm">
            <Shield size={36} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Privacy Policy</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Last Updated: March 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Information We Collect</h2>
            <p>At BookingBuddy, we collect personal information such as your name, email address, phone number, and payment details when you book a tour or create an account. We also automatically collect standard browsing data like your IP address and device information to improve our services and user experience.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. How We Use Your Information</h2>
            <p>We use your data strictly to process your bookings, communicate with you regarding your itinerary, and ensure a seamless travel experience. We may also use your email to send promotional offers if you have explicitly opted in during registration.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Data Sharing & Security</h2>
            <p>We do not sell your personal data. We only share necessary information with trusted third-party partners (like airlines, hotels, and payment gateways) exclusively to fulfill your travel bookings. We use industry-standard 256-bit encryption to protect your financial and personal data from unauthorized access.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Cookies and Tracking</h2>
            <p>Our platform utilizes cookies to remember your login state, theme preferences (Dark/Light mode), and to track basic analytics. You can disable cookies through your browser settings, though this may affect the functionality of the booking platform.</p>
          </section>
        </div>
        
      </div>
    </div>
  );
};

export default PrivacyPolicy;