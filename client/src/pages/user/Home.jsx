import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Calendar,
  Star,
  Mountain,
  Palmtree,
  Building,
  Compass,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Lock, 
  X     
} from "lucide-react";
import { tourData } from "../data/tours";
import TourCard from "../../components/TourCard";
import Footer from "../../components/Footer";

const categories = [
  { name: "Mountain Treks", icon: Mountain },
  { name: "Beach Holidays", icon: Palmtree },
  { name: "City Explorers", icon: Building },
  { name: "Adventure", icon: Compass },
];

const faqs = [
  {
    question: "How do I book a tour on Briskode Tours?",
    answer: "Booking is simple! Browse our Packages page, select your desired destination, choose your dates and number of guests on the Tour Details page, and click 'Proceed to Book'.",
  },
  {
    question: "What is your cancellation policy?",
    answer: "You can cancel for a full refund up to 7 days before your tour's start date.",
  },
  {
    question: "Are flights included in the package prices?",
    answer: "No, our standard packages cover accommodation, guided tours, local transfers, and specified meals. Flights are not included unless explicitly stated.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // --- UNIVERSAL SECURITY INTERCEPTOR ---
  const handleProtectedAction = (actionFunction) => {
    const isAuthenticated = localStorage.getItem('userToken');
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      actionFunction();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleProtectedAction(() => {
      const params = new URLSearchParams();
      if (destination) params.append("search", destination.toLowerCase()); // Changed to 'search' to match our global filter!
      navigate(`/tours?${params.toString()}`);
    });
  };

  return (
    <div className="relative min-h-screen transition-colors duration-300 font-sans">
      
      {/* Background Video */}
      <div className="fixed inset-0 z-0 bg-slate-900">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-100 scale-105">
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-black/20 to-gray-50 dark:from-slate-900/80 dark:via-black/40 dark:to-slate-950 transition-colors duration-500"></div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* HERO SECTION */}
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-sm mb-8 shadow-sm">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            Premium Tour Booking
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight drop-shadow-lg leading-tight">
            Find Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              Escape
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto font-medium drop-shadow-md">
            Discover breathtaking destinations, exclusive packages, and unforgettable experiences worldwide.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 w-full">
          <form
            onSubmit={handleSearch}
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-2.5 rounded-[3rem] shadow-2xl border border-white/40 dark:border-slate-700/50 flex flex-col md:flex-row items-center gap-2 transition-all"
          >
            <div className="flex-1 w-full px-6 py-3.5 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 rounded-full cursor-text transition-colors">
              <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where are you going?"
                className="w-full bg-transparent text-slate-900 dark:text-white font-bold text-lg focus:outline-none placeholder-gray-400"
              />
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-200 dark:bg-slate-800"></div>
            <div className="flex-1 w-full px-6 py-3.5 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 rounded-full cursor-pointer transition-colors">
              <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Dates</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent text-slate-900 dark:text-white font-bold text-lg focus:outline-none cursor-pointer dark:[color-scheme:dark]"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white p-5 rounded-full shadow-lg shadow-primary-600/20 transition-transform hover:scale-105 flex items-center justify-center gap-3 md:gap-0"
            >
              <Search size={22} strokeWidth={2.5} />
              <span className="md:hidden font-bold">Search Tours</span>
            </button>
          </form>
        </div>

        <div className="flex-1 flex flex-col">
          
          {/* CATEGORIES SECTION */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div
                  key={index}
                  // FIX: Pass the category name as a URL parameter!
                  onClick={() => handleProtectedAction(() => navigate(`/tours?search=${encodeURIComponent(category.name)}`))} 
                  className="group bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-white/50 dark:border-slate-800/50 flex flex-col items-center justify-center gap-5 hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:shadow-xl hover:border-primary-500/30"
                >
                  <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                    <category.icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white tracking-tight">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* FEATURED TOURS SECTION */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-5xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Trending Destinations</h2>
                <p className="text-lg text-white dark:text-orange-400 mt-3 font-medium">Handpicked premium packages for your next adventure.</p>
              </div>
              <button 
                onClick={() => handleProtectedAction(() => navigate('/tours'))} 
                className="text-primary-600 dark:text-primary-400 font-bold hover:underline"
              >
                View all tours &rarr;
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {tourData.slice(0, 6).map((tour) => (
                <div key={tour.id} onClick={() => handleProtectedAction(() => navigate(`/tours/${tour.id}`))}>
                  <TourCard tour={tour} />
                </div>
              ))}
            </div>
          </div>

          {/* FAQ SECTION */}
          <div className="relative py-24 pb-32 mt-auto w-full">
            <div className="absolute inset-0 backdrop-blur-3xl bg-white/40 dark:bg-slate-950/60 pointer-events-none border-t border-white/30 dark:border-slate-800/50"></div>
            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-white/50 dark:border-slate-700/50 overflow-hidden transition-all duration-300 hover:bg-white/80 dark:hover:bg-slate-900/80">
                    <button className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none" onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}>
                      <span className="font-bold text-lg text-slate-900 dark:text-white">{faq.question}</span>
                      <div className={`p-2 rounded-full transition-colors ${openFaqIndex === index ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                        {openFaqIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>
                    <div className={`px-8 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                      <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="relative z-10 w-full">
            <Footer />
          </div>

        </div>
      </div>

      {/* SLEEK AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-opacity">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-white/20 dark:border-slate-700/50">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-full text-primary-600 dark:text-primary-400">
                <Lock size={24} strokeWidth={2.5} />
              </div>
              <button onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white p-2 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Sign in Required</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 text-sm">
              Please log in to unlock search, view detailed itineraries, and secure your next adventure.
            </p>
            
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate('/login')} className="w-full bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors">
                Log In / Register
              </button>
              <button onClick={() => setShowAuthModal(false)} className="w-full bg-transparent hover:bg-gray-50 text-slate-600 font-bold py-4 rounded-xl transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;