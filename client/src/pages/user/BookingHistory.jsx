import React, { useState } from 'react';
import { Calendar, MapPin, XCircle, Star, X, CheckCircle, AlertTriangle } from 'lucide-react';

const mockBookings = [
  { 
    id: 'BRK-8921', 
    tour: 'Puri & Konark', 
    date: 'Oct 15, 2026', 
    guests: 2, 
    status: 'Upcoming', 
    total: 2400, 
    image: 'https://admin.bookodisha.com/images/pages/Discover-the-Best-03_1657554549.jpg' 
  },
  { 
    id: 'BRK-4432', 
    tour: 'Chilika Lake', 
    date: 'Jan 10, 2026', 
    guests: 1, 
    status: 'Completed', 
    total: 18000, 
    image: 'https://otdc.odisha.gov.in/storage/explore/1707229583_chilikalake.webp' 
  },
];

const BookingHistory = () => {
  // --- REVIEW MODAL STATES ---
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- CANCEL MODAL STATES ---
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  // --- HANDLERS FOR REVIEW ---
  const handleOpenReview = (booking) => {
    setSelectedBooking(booking);
    setRating(0);
    setReviewText("");
    setIsSuccess(false);
    setShowReviewModal(true);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating!");
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setShowReviewModal(false), 2000);
    }, 1500);
  };

  // --- HANDLERS FOR CANCEL ---
  const handleOpenCancel = (booking) => {
    setBookingToCancel(booking);
    setCancelSuccess(false);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setIsCancelling(true);
    
    // Simulate API call for cancellation
    setTimeout(() => {
      setIsCancelling(false);
      setCancelSuccess(true);
      
      // Auto-close modal after showing success message
      setTimeout(() => {
        setShowCancelModal(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen transition-colors duration-300">
      
      {/* --- FIXED FULL-PAGE VIDEO BACKGROUND --- */}
      <div className="fixed inset-0 z-0 bg-slate-900">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-90 scale-105"
        >
          <source src="/hero1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-white/40 dark:to-slate-950/60 backdrop-blur-lg transition-colors duration-500"></div>
      </div>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="relative z-10 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mt-10 mb-8">
            <h1 className="text-3xl font-black text-primary-500 dark:text-primary-400 tracking-tight drop-shadow-sm">My Bookings</h1>
            <p className="text-slate-200 dark:text-slate-300 font-bold mt-1 drop-shadow-md">Manage your upcoming and past adventures.</p>
          </div>
          
          <div className="space-y-6">
            {mockBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2rem] p-4 sm:p-6 shadow-lg border border-white/40 dark:border-slate-700/50 flex flex-col sm:flex-row gap-6 items-center sm:items-start transition-all hover:shadow-2xl dark:hover:shadow-primary-900/20 group"
              >
                <div className="relative w-full sm:w-48 h-32 overflow-hidden rounded-2xl shadow-sm">
                  <img 
                    src={booking.image} 
                    alt={booking.tour} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-bold text-primary-700 dark:text-primary-400 mb-1">Booking ID: {booking.id}</p>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">{booking.tour}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                      booking.status === 'Upcoming' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300' : 
                      booking.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-slate-700 dark:text-slate-300 font-bold">
                    <div className="flex items-center gap-2"><Calendar size={16} className="text-slate-500 dark:text-slate-400" /> {booking.date}</div>
                    <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-500 dark:text-slate-400" /> {booking.guests} Guest(s)</div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex flex-col sm:items-end justify-between h-full space-y-4 sm:space-y-0 border-t sm:border-t-0 sm:border-l border-white/50 dark:border-slate-700/50 pt-4 sm:pt-0 sm:pl-6 mt-4 sm:mt-0">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">₹{booking.total}</div>
                  
                  {booking.status === 'Upcoming' && (
                    <button 
                      onClick={() => handleOpenCancel(booking)} // Trigger Cancel Modal
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-xl font-bold transition-colors"
                    >
                      <XCircle size={16} /> Cancel
                    </button>
                  )}
                  {booking.status === 'Completed' && (
                    <button 
                      onClick={() => handleOpenReview(booking)}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-slate-900/20 dark:shadow-primary-900/20"
                    >
                      Leave a Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- REVIEW MODAL --- */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-lg shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden transform transition-all">
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 flex justify-between items-center border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                Rate Your Experience
              </h3>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-slate-800 dark:hover:text-white p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm transition-colors"
                disabled={isSubmitting || isSuccess}
              >
                <X size={20} />
              </button>
            </div>

            {isSuccess ? (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-500">
                  <CheckCircle size={32} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Thank You!</h4>
                <p className="text-slate-500 font-medium">Your review for {selectedBooking.tour} has been submitted successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="p-6">
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                  <img src={selectedBooking.image} alt={selectedBooking.tour} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">Reviewing</p>
                    <p className="font-bold text-slate-900 dark:text-white text-lg">{selectedBooking.tour}</p>
                  </div>
                </div>

                <div className="mb-6 flex flex-col items-center">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">How was your trip?</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star 
                          size={36} 
                          className={`transition-colors duration-200 ${
                            star <= (hoverRating || rating) 
                              ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm' 
                              : 'text-gray-200 dark:text-slate-700'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Write your review</label>
                  <textarea 
                    rows="4"
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Tell us what you loved about this tour..."
                    className="w-full p-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 font-medium resize-none placeholder-gray-400 dark:placeholder-slate-600 transition-colors"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-primary-500/20 disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- CANCEL BOOKING MODAL --- */}
      {showCancelModal && bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden transform transition-all">
            
            {/* Modal Header */}
            <div className="bg-red-50 dark:bg-red-900/20 p-6 flex justify-between items-center border-b border-red-100 dark:border-red-900/50">
              <h3 className="text-xl font-black text-red-600 dark:text-red-400 flex items-center gap-2 tracking-tight">
                <AlertTriangle size={22} /> Cancel Booking
              </h3>
              <button 
                onClick={() => setShowCancelModal(false)}
                className="text-red-400 hover:text-red-600 dark:hover:text-red-300 p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm transition-colors"
                disabled={isCancelling || cancelSuccess}
              >
                <X size={20} />
              </button>
            </div>

            {cancelSuccess ? (
              // Success State
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-500">
                  <CheckCircle size={32} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Cancellation Confirmed</h4>
                <p className="text-slate-500 font-medium leading-relaxed">Your booking for <strong>{bookingToCancel.tour}</strong> has been cancelled. A refund receipt has been sent to your email.</p>
              </div>
            ) : (
              // Warning State
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                  <img src={bookingToCancel.image} alt={bookingToCancel.tour} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Booking ID: {bookingToCancel.id}</p>
                    <p className="font-bold text-slate-900 dark:text-white text-lg">{bookingToCancel.tour}</p>
                    <p className="text-sm font-medium text-slate-500">{bookingToCancel.date}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Are you sure you want to cancel this booking? This action cannot be undone. Cancellations are subject to our standard <a href="/cancellation" className="text-primary-600 dark:text-primary-400 hover:underline">cancellation policy</a>.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleConfirmCancel}
                    disabled={isCancelling}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-red-500/20 disabled:opacity-70 flex justify-center items-center gap-2"
                  >
                    {isCancelling ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      "Yes, Cancel Booking"
                    )}
                  </button>
                  <button 
                    onClick={() => setShowCancelModal(false)}
                    disabled={isCancelling}
                    className="w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl transition-colors"
                  >
                    No, Keep My Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingHistory;