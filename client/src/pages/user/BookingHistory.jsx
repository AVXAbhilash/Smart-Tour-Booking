import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, XCircle, Star, X, CheckCircle, AlertTriangle, Loader, CreditCard, RefreshCcw } from 'lucide-react';

const BookingHistory = () => {
  // --- DATABASE STATES ---
  const [bookings, setBookings] = useState([]);
  const [reviewedBookingIds, setReviewedBookingIds] = useState([]); // <-- NEW: Tracks which bookings have reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // --- REFUND MODAL STATES ---
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [bookingToRefund, setBookingToRefund] = useState(null);
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundSuccess, setRefundSuccess] = useState(false);
  const [refundData, setRefundData] = useState({
    cardName: '',
    cardBrand: 'Visa',
    cardNumber: ''
  });

  // --- FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch BOTH bookings and reviews at the same time to see what's already reviewed!
        const [bookingsRes, reviewsRes] = await Promise.all([
          axios.get('http://localhost:5200/api/bookings/mybookings', config),
          axios.get('http://localhost:5200/api/reviews/myreviews', config).catch(() => ({ data: [] }))
        ]);

        setBookings(bookingsRes.data);

        // Extract an array of just the booking IDs that already have a review
        const alreadyReviewedIds = reviewsRes.data.map(review => review.booking);
        setReviewedBookingIds(alreadyReviewedIds);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bookings.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- HELPER TO DETERMINE STATUS ---
  const getBookingStatus = (booking) => {
    if (booking.status === 'Cancelled') return 'Cancelled';
    const date = new Date(booking.selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return date >= today ? 'Upcoming' : 'Completed';
  };

  // --- HANDLERS FOR REVIEW ---
  const handleOpenReview = (booking) => {
    setSelectedBooking(booking);
    setRating(0);
    setReviewText("");
    setIsSuccess(false);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating!");
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('userToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.post('http://localhost:5200/api/reviews', {
        tour: selectedBooking.tour._id,
        rating: rating,
        reviewText: reviewText
      }, config);

      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Instantly add this booking ID to our reviewed list so the button vanishes!
      setReviewedBookingIds([...reviewedBookingIds, selectedBooking._id]);

      setTimeout(() => setShowReviewModal(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review.");
      setIsSubmitting(false);
    }
  };

  // --- HANDLERS FOR CANCEL ---
  const handleOpenCancel = (booking) => {
    setBookingToCancel(booking);
    setCancelSuccess(false);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      const token = localStorage.getItem('userToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`http://localhost:5200/api/bookings/${bookingToCancel._id}`, {
        status: 'Cancelled'
      }, config);

      setIsCancelling(false);
      setCancelSuccess(true);
      
      setBookings(bookings.map(b => 
        b._id === bookingToCancel._id ? { ...b, status: 'Cancelled' } : b
      ));

      setTimeout(() => setShowCancelModal(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking.");
      setIsCancelling(false);
    }
  };

  // --- HANDLERS FOR REFUND ---
  const handleOpenRefund = (booking) => {
    setBookingToRefund(booking);
    setRefundSuccess(false);
    setRefundData({ cardName: '', cardBrand: 'Visa', cardNumber: '' });
    setShowRefundModal(true);
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    setIsRefunding(true);

    try {
      const token = localStorage.getItem('userToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`http://localhost:5200/api/bookings/${bookingToRefund._id}`, {
        refundDetails: refundData 
      }, config);

      setIsRefunding(false);
      setRefundSuccess(true);
      
      setBookings(bookings.map(b => 
        b._id === bookingToRefund._id ? { ...b, refundStatus: 'Pending' } : b
      ));

      setTimeout(() => {
        setShowRefundModal(false);
      }, 2500);

    } catch (err) {
      alert(err.response?.data?.message || "Failed to process refund request.");
      setIsRefunding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader className="animate-spin text-primary-500" size={48} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen transition-colors duration-300">
      
      <div className="fixed inset-0 z-0 bg-slate-900">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90 scale-105">
          <source src="/hero1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-white/40 dark:to-slate-950/60 backdrop-blur-lg transition-colors duration-500"></div>
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mt-10 mb-8">
            <h1 className="text-3xl font-black text-primary-500 dark:text-primary-400 tracking-tight drop-shadow-sm">My Bookings</h1>
            <p className="text-slate-200 dark:text-slate-300 font-bold mt-1 drop-shadow-md">Manage your upcoming and past adventures.</p>
          </div>
          
          {error && <div className="bg-red-500/20 text-red-200 p-4 rounded-xl mb-6 font-bold">{error}</div>}

          {bookings.length === 0 ? (
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2rem] p-12 text-center shadow-lg border border-white/40 dark:border-slate-700/50">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No Bookings Found</h2>
               <p className="text-slate-700 dark:text-slate-300">You haven't booked any tours yet. Time to explore!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => {
                const status = getBookingStatus(booking);
                const hasReviewed = reviewedBookingIds.includes(booking._id); // <-- Check if it's reviewed

                return (
                <div 
                  key={booking._id} 
                  className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2rem] p-4 sm:p-6 shadow-lg border border-white/40 dark:border-slate-700/50 flex flex-col sm:flex-row gap-6 items-center sm:items-start transition-all hover:shadow-2xl dark:hover:shadow-primary-900/20 group"
                >
                  <div className="relative w-full sm:w-48 h-32 overflow-hidden rounded-2xl shadow-sm">
                    <img 
                      src={booking.tour?.image || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05'} 
                      alt={booking.tour?.title} 
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${status === 'Cancelled' ? 'grayscale opacity-70' : ''}`} 
                    />
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-bold text-primary-700 dark:text-primary-400 mb-1">
                          Booking ID: {booking.bookingId || booking._id}
                        </p>
                        <h3 className={`text-xl font-black ${status === 'Cancelled' ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>
                          {booking.tour?.title || 'Tour details unavailable'}
                        </h3>
                      </div>
                      
                      <div className="flex flex-col gap-2 items-end">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                          status === 'Upcoming' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300' : 
                          status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' 
                        }`}>
                          {status}
                        </span>

                        {status === 'Cancelled' && booking.refundStatus && booking.refundStatus !== 'Not Eligible' && (
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                            booking.refundStatus === 'Pending' 
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' 
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                          }`}>
                            Refund: {booking.refundStatus}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-slate-700 dark:text-slate-300 font-bold">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-slate-500 dark:text-slate-400" /> 
                        {new Date(booking.selectedDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-slate-500 dark:text-slate-400" /> 
                        {booking.guests} Guest(s)
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex flex-col sm:items-end justify-between h-full space-y-4 sm:space-y-0 border-t sm:border-t-0 sm:border-l border-white/50 dark:border-slate-700/50 pt-4 sm:pt-0 sm:pl-6 mt-4 sm:mt-0">
                    <div className={`text-2xl font-black ${status === 'Cancelled' ? 'text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                      ₹{booking.totalAmount?.toLocaleString()}
                    </div>
                    
                    {/* --- BUTTON VISIBILITY LOGIC --- */}
                    {status === 'Upcoming' && (
                      <button 
                        onClick={() => handleOpenCancel(booking)}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-xl font-bold transition-colors"
                      >
                        <XCircle size={16} /> Cancel
                      </button>
                    )}

                    {/* --- THE REVIEW BUTTON LOGIC --- */}
                    {status === 'Completed' && !hasReviewed && (
                      <button 
                        onClick={() => handleOpenReview(booking)}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-slate-900/20 dark:shadow-primary-900/20"
                      >
                        Leave a Review
                      </button>
                    )}
                    {status === 'Completed' && hasReviewed && (
                      <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-bold px-4 py-2">
                        <CheckCircle size={18} /> Reviewed
                      </div>
                    )}

                    {/* ONLY show Request Refund button if it hasn't been requested yet! */}
                    {status === 'Cancelled' && (!booking.refundStatus || booking.refundStatus === 'Not Eligible') && (
                      <button 
                        onClick={() => handleOpenRefund(booking)}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-xl font-bold transition-colors"
                      >
                        <RefreshCcw size={16} /> Request Refund
                      </button>
                    )}
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </div>

      {/* --- REVIEW MODAL --- */}
      {showReviewModal && selectedBooking && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-lg shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden transform transition-all">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 flex justify-between items-center border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">Rate Your Experience</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm transition-colors" disabled={isSubmitting || isSuccess}><X size={20} /></button>
            </div>
            {isSuccess ? (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-500"><CheckCircle size={32} /></div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Thank You!</h4>
                <p className="text-slate-500 font-medium">Your review has been submitted.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="p-6">
                <div className="mb-6 flex flex-col items-center">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="focus:outline-none transition-transform hover:scale-110 active:scale-95">
                        <Star size={36} className={`transition-colors duration-200 ${star <= (hoverRating || rating) ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm' : 'text-gray-200 dark:text-slate-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <textarea rows="4" required value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Tell us what you loved..." className="w-full p-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 font-medium resize-none placeholder-gray-400 dark:placeholder-slate-600 transition-colors"></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-primary-500/20 disabled:opacity-70 flex justify-center items-center gap-2">
                  {isSubmitting ? "Submitting..." : "Submit Review"}
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
            <div className="bg-red-50 dark:bg-red-900/20 p-6 flex justify-between items-center border-b border-red-100 dark:border-red-900/50">
              <h3 className="text-xl font-black text-red-600 dark:text-red-400 flex items-center gap-2 tracking-tight"><AlertTriangle size={22} /> Cancel Booking</h3>
              <button onClick={() => setShowCancelModal(false)} className="text-red-400 hover:text-red-600 dark:hover:text-red-300 p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm transition-colors" disabled={isCancelling || cancelSuccess}><X size={20} /></button>
            </div>
            {cancelSuccess ? (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-500"><CheckCircle size={32} /></div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Cancellation Confirmed</h4>
                <p className="text-slate-500 font-medium leading-relaxed">Your booking has been cancelled.</p>
              </div>
            ) : (
              <div className="p-6">
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-8">Are you sure you want to cancel this booking? This action cannot be undone.</p>
                <div className="flex flex-col gap-3">
                  <button onClick={handleConfirmCancel} disabled={isCancelling} className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-red-500/20 disabled:opacity-70 flex justify-center items-center gap-2">
                    {isCancelling ? "Processing..." : "Yes, Cancel Booking"}
                  </button>
                  <button onClick={() => setShowCancelModal(false)} disabled={isCancelling} className="w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl transition-colors">
                    No, Keep My Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- REFUND MODAL --- */}
      {showRefundModal && bookingToRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden transform transition-all">
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 flex justify-between items-center border-b border-blue-100 dark:border-blue-900/50">
              <h3 className="text-xl font-black text-blue-600 dark:text-blue-400 flex items-center gap-2 tracking-tight">
                <CreditCard size={22} /> Request Refund
              </h3>
              <button 
                onClick={() => setShowRefundModal(false)}
                className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm transition-colors"
                disabled={isRefunding || refundSuccess}
              >
                <X size={20} />
              </button>
            </div>

            {refundSuccess ? (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 text-blue-500">
                  <CheckCircle size={32} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Refund Initiated!</h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  We are processing your refund of <strong>₹{bookingToRefund.totalAmount?.toLocaleString()}</strong> back to your {refundData.cardBrand} card ending in {refundData.cardNumber.slice(-4)}. This may take 3-5 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRefundSubmit} className="p-6">
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                  <img src={bookingToRefund.tour?.image || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05'} alt="Tour" className="w-16 h-16 rounded-xl object-cover grayscale opacity-70" />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Refunding: {bookingToRefund.bookingId || bookingToRefund._id}</p>
                    <p className="font-bold text-slate-900 dark:text-white text-lg">{bookingToRefund.tour?.title}</p>
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Refund Amount: ₹{bookingToRefund.totalAmount?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-2">Please enter the card details where you would like the funds returned.</p>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={refundData.cardName}
                      onChange={(e) => setRefundData({...refundData, cardName: e.target.value})}
                      placeholder="John Doe"
                      disabled={isRefunding}
                      className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Card Brand</label>
                    <select
                      value={refundData.cardBrand}
                      onChange={(e) => setRefundData({...refundData, cardBrand: e.target.value})}
                      disabled={isRefunding}
                      className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium appearance-none cursor-pointer"
                    >
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="Amex">American Express</option>
                      <option value="RuPay">RuPay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Card Number</label>
                    <div className="relative">
                      <CreditCard size={18} className="absolute left-3 top-3.5 text-gray-400 dark:text-slate-500" />
                      <input
                        type="text"
                        required
                        maxLength="19"
                        value={refundData.cardNumber}
                        onChange={(e) => setRefundData({...refundData, cardNumber: e.target.value.replace(/\D/g, '')})}
                        placeholder="0000 0000 0000 0000"
                        disabled={isRefunding}
                        className="w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    type="submit"
                    disabled={isRefunding}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-blue-500/20 disabled:opacity-70 flex justify-center items-center gap-2"
                  >
                    {isRefunding ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      "Confirm Refund"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingHistory;