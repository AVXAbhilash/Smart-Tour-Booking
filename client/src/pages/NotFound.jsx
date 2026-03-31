import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Globe } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden p-4">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606" 
          alt="Lost in the mountains" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
      </div>

      {/* 404 Glass Card */}
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl relative z-10 text-center">
        
        <div className="flex justify-center mb-6">
          <div className="bg-primary-600/20 p-4 rounded-full border border-primary-500/30">
            <Compass size={48} className="text-primary-400 animate-pulse" />
          </div>
        </div>

        <h1 className="text-7xl font-extrabold text-white mb-2 tracking-tighter drop-shadow-md">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          Looks like you're off the map!
        </h2>
        
        <p className="text-primary-100/70 mb-8 leading-relaxed">
          The destination you are looking for doesn't exist or has been moved. Let's get you back on track with Briskode Tours.
        </p>

        <Link 
          to="/" 
          className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-primary-500/30 w-full sm:w-auto"
        >
          <ArrowLeft size={18} /> Back to Civilization
        </Link>
        
        <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
          <Link to="/" className="flex items-center gap-2 group opacity-70 hover:opacity-100 transition-opacity">
            <Globe className="text-white" size={20} />
            <span className="font-bold text-lg tracking-tight text-white">
              Booking<span className="text-primary-400">Buddy</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;