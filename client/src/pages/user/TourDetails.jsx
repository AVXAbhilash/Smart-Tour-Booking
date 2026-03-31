import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Clock, Users, Star, CheckCircle, ArrowLeft, 
  X, CreditCard, Lock, Calendar as CalendarIcon, ShieldCheck 
} from 'lucide-react';
import { tourData } from '../data/tours';

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // --- STATES ---
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const tour = tourData.find((t) => t.id === id);

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Tour Not Found</h2>
        <p className="text-slate-500 mb-6">We couldn't find the tour you're looking for.</p>
        <Link to="/tours" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Packages
        </Link>
      </div>
    );
  }

  // Calculate total price dynamically
  const totalPrice = tour.price * guests;

  const handleProceedToBook = (e) => {
    e.preventDefault();
    if (!date) {
      alert("Please select a date for your tour!");
      return;
    }
    // Open the payment modal
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate a secure payment processing delay (2 seconds)
    setTimeout(() => {
      setIsProcessing(false);
      setShowPaymentModal(false);
      // Redirect to the booking history page after successful payment
      navigate('/my-bookings');
    }, 2000);
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen pb-20 transition-colors duration-300 relative">
      {/* Tour Hero Image */}
      <div className="h-[50vh] w-full relative">
        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-primary-300 font-medium mb-2">
            <MapPin size={18} /> {tour.location}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">{tour.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Reviews */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
            <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                <Clock className="text-primary-600 dark:text-primary-400" /> {tour.days} Days / {tour.days - 1} Nights
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                <Users className="text-primary-600 dark:text-primary-400" /> Max 12 People
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                <Star className="text-primary-500 fill-primary-500" /> {tour.rating} ({tour.reviews} Reviews)
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Overview</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-8 font-medium">
              Experience the magic of {tour.location} with this curated {tour.days}-day escapade. Perfect for adventurers and relaxation-seekers alike, this tour offers an unforgettable journey through our most highly-rated destinations.
            </p>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">What's Included</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600 dark:text-slate-400 font-medium">
              {[
                `${tour.days - 1} Nights Accommodation`, 
                'Daily Breakfast', 
                'Airport Transfers', 
                'Expert Local Guide', 
                'All Entry Fees'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Reviews Section Placeholder */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Guest Reviews</h2>
            <div className="text-center py-8 text-gray-500 dark:text-slate-500 border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-xl font-medium">
              Reviews for {tour.title} will be displayed here.
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl dark:shadow-primary-900/10 border border-gray-100 dark:border-slate-800 sticky top-28 transition-colors">
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              ₹{tour.price.toLocaleString()} <span className="text-base font-medium text-gray-500 dark:text-slate-500">/ person</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-gray-500 dark:text-slate-400 mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
              <Star size={14} className="text-primary-500 fill-primary-500" /> {tour.rating} rating
            </div>

            <form onSubmit={handleProceedToBook} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Select Date</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 dark:[color-scheme:dark]" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Guests</label>
                <select 
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Adult' : 'Adults'}</option>
                  ))}
                </select>
              </div>
              
              <div className="pt-4 pb-2 flex justify-between items-center font-black text-lg text-slate-900 dark:text-white border-t border-gray-100 dark:border-slate-800">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-primary-500/30 mt-4 flex justify-center items-center gap-2"
              >
                Proceed to Book
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- PAYMENT UI MODAL --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-lg shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 flex justify-between items-center border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                <Lock size={20} className="text-primary-500" /> Secure Checkout
              </h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-800 dark:hover:text-white p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm transition-colors"
                disabled={isProcessing}
              >
                <X size={20} />
              </button>
            </div>

            {/* Order Summary */}
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Order Summary</h4>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{tour.title}</p>
                  <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-1">
                    <CalendarIcon size={14} /> {date} • {guests} {guests === 1 ? 'Guest' : 'Guests'}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold text-slate-700 dark:text-slate-300">Total Amount</span>
                <span className="text-2xl font-black text-primary-600 dark:text-primary-400">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Payment Details Form */}
            <form onSubmit={handlePaymentSubmit} className="p-6 bg-slate-50/50 dark:bg-slate-900">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Payment Details</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Cardholder Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="John Doe"
                    disabled={isProcessing}
                    className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 font-medium" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Card Number</label>
                  <div className="relative">
                    <CreditCard size={18} className="absolute left-3 top-3.5 text-gray-400 dark:text-slate-500" />
                    <input 
                      type="text" 
                      required 
                      maxLength="19"
                      placeholder="0000 0000 0000 0000"
                      disabled={isProcessing}
                      className="w-full pl-10 pr-3 py-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 font-medium" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Expiry Date</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="MM/YY"
                      maxLength="5"
                      disabled={isProcessing}
                      className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">CVV</label>
                    <input 
                      type="password" 
                      required 
                      placeholder="123"
                      maxLength="4"
                      disabled={isProcessing}
                      className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 font-medium tracking-widest" 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={16} /> Payments are 256-bit encrypted
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full mt-4 bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-500 text-white font-black py-4 rounded-xl transition-colors shadow-xl disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  `Pay ₹${totalPrice.toLocaleString()}`
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDetails;