import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    // FIX: Added `relative z-10` so it always stays above the fixed video backgrounds!
    <footer className="relative z-10 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 border-t border-gray-200 dark:border-slate-800 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <Globe className="text-primary-500" size={28} />
              <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
                Booking<span className="text-primary-500">Buddy</span>
              </span>
            </Link>
            <p className="text-sm mb-6 leading-relaxed">
              Experience the world with smart, seamless, and secure tour booking. Your next adventure starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-4 tracking-wider uppercase text-sm">Explore</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Destinations</Link></li>
              <li><Link to="/tours" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">All Packages</Link></li>
              <li><Link to="/profile" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">User Account</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-4 tracking-wider uppercase text-sm">Legal</h3>
            <ul className="space-y-3 text-sm font-medium">
              {/* FIX: Updated the routes for the legal pages! */}
              <li><Link to="/legal/PrivacyPolicy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/legal/TermsOfService" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/legal/CancellationPolicy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-4 tracking-wider uppercase text-sm">Contact Us</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li className="flex items-center gap-3"><Mail size={16} className="text-primary-500"/> support@bookingbuddy.com</li>
              <li className="flex items-center gap-3"><Phone size={16} className="text-primary-500"/> +91 (555) 123-4567</li>
              <li className="flex items-center gap-3"><MapPin size={16} className="text-primary-500"/> Infocity, Bhubaneswar</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} BookingBuddy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;