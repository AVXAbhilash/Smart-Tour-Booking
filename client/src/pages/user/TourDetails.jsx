import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Clock,
  Users,
  Star,
  CheckCircle,
  ArrowLeft,
  X,
  CreditCard,
  Lock,
  Calendar as CalendarIcon,
  ShieldCheck,
  Loader,
  // MessageSquare,
} from "lucide-react";

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- DATABASE STATES ---
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // --- BOOKING FORM STATES ---
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- PAYMENT FORM STATES ---
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardBrand, setCardBrand] = useState("Visa"); // <-- NEW STATE (Default to Visa)

  // --- NEW: REVIEW FORM STATES ---
  // const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  // const [reviewText, setReviewText] = useState("");
  // const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  // const [reviewMessage, setReviewMessage] = useState({ type: "", text: "" });

  // --- FETCH SINGLE TOUR ---
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5200/api/tours/${id}`,
        );
        setTour(response.data.tour || response.data);
        setLoading(false);
      } catch (err) {
        setFetchError(
          err.response?.data?.message || "Failed to fetch tour details.",
        );
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  useEffect(() => {
    const fetchTourAndReviews = async () => {
      try {
        // 1. Fetch the Tour (using TR-101)
        const tourRes = await axios.get(
          `http://localhost:5200/api/tours/${id}`,
        );
        const fetchedTour = tourRes.data.tour || tourRes.data;
        setTour(fetchedTour);

        // 2. Fetch the Reviews (Using the MongoDB _id of the tour we just got!)
        const reviewsRes = await axios.get(
          `http://localhost:5200/api/reviews/tour/${fetchedTour._id}`,
        );
        setReviews(reviewsRes.data);

        setLoading(false);
      } catch (err) {
        setFetchError(
          err.response?.data?.message || "Failed to fetch details.",
        );
        setLoading(false);
      }
    };

    fetchTourAndReviews();
  }, [id]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("Please log in to book a tour!");
      navigate("/login");
      return;
    }

    setIsProcessing(true);

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Helper to detect card brand based on the first digit
      let brand = "Unknown";
      if (cardNumber.startsWith("4")) brand = "Visa";
      else if (cardNumber.startsWith("5")) brand = "Mastercard";
      // eslint-disable-next-line no-unused-vars
      else if (cardNumber.startsWith("3")) brand = "Amex";

      // The exact payload your new backend expects!
      // The exact payload your backend expects!
      const bookingData = {
        tour: tour._id,
        selectedDate: date,
        guests: guests,
        totalAmount: tour.price * guests,
        paymentDetails: {
          transactionId: `txn_mock_${Date.now()}`,
          cardBrand: cardBrand, // <-- Use the dropdown selection directly!
          last4: cardNumber.slice(-4) || "0000",
        },
      };

      // ... existing axios request ...

      await axios.post(
        "http://localhost:5200/api/bookings",
        bookingData,
        config,
      );

      setIsProcessing(false);
      setShowPaymentModal(false);
      navigate("/my-bookings");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Payment/Booking failed. Please try again.",
      );
      setIsProcessing(false);
    }
  };

  const handleProceedToBook = (e) => {
    e.preventDefault();
    if (!date) {
      alert("Please select a date for your tour!");
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("You must be logged in to book a tour. Let's get you signed in!");
      navigate("/login");
      return;
    }

    setShowPaymentModal(true);
  };

  // --- NEW: HANDLE REVIEW SUBMISSION ---
  // const handleReviewSubmit = async (e) => {
  //   e.preventDefault();
  //   setReviewMessage({ type: "", text: "" });

  //   const token = localStorage.getItem("userToken");
  //   if (!token) {
  //     setReviewMessage({
  //       type: "error",
  //       text: "You must be logged in to write a review.",
  //     });
  //     return;
  //   }

  //   if (reviewText.trim().length < 10) {
  //     setReviewMessage({
  //       type: "error",
  //       text: "Please write a review of at least 10 characters.",
  //     });
  //     return;
  //   }

  //   setIsSubmittingReview(true);

  //   try {
  //     const config = { headers: { Authorization: `Bearer ${token}` } };

  //     // Sending review data to your backend
  //     await axios.post(
  //       "http://localhost:5200/api/reviews",
  //       {
  //         tour: tour._id,
  //         rating,
  //         reviewText,
  //       },
  //       config,
  //     );

  //     setReviewMessage({
  //       type: "success",
  //       text: "Thank you! Your review has been submitted.",
  //     });
  //     setReviewText("");
  //     setRating(5); // Reset back to 5 stars

  //     // Optional: You could trigger a re-fetch of the tour here to show the new review instantly
  //   } catch (err) {
  //     setReviewMessage({
  //       type: "error",
  //       text:
  //         err.response?.data?.message ||
  //         "Failed to submit review. You may have already reviewed this tour.",
  //     });
  //   } finally {
  //     setIsSubmittingReview(false);
  //   }
  // };

  // --- UI RENDERING ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950">
        <Loader className="animate-spin text-primary-600 mb-4" size={48} />
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">
          Loading tour details...
        </h2>
      </div>
    );
  }

  if (fetchError || !tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
          Tour Not Found
        </h2>
        <p className="text-slate-500 mb-6">
          {fetchError || "We couldn't find the tour you're looking for."}
        </p>
        <Link
          to="/"
          className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back to Packages
        </Link>
      </div>
    );
  }

  const totalPrice = tour.price * guests;

  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen pb-20 transition-colors duration-300 relative">
      {/* Tour Hero Image */}
      <div className="h-[50vh] w-full relative">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-primary-300 font-medium mb-2">
            <MapPin size={18} /> {tour.location}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            {tour.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Reviews */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
            <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                <Clock className="text-primary-600 dark:text-primary-400" />{" "}
                {tour.days} Days / {tour.days - 1} Nights
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                <Users className="text-primary-600 dark:text-primary-400" /> Max
                12 People
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                <Star className="text-primary-500 fill-primary-500" />{" "}
                {tour.rating || 5.0} ({tour.reviews || 0} Reviews)
              </div>
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
              Overview
            </h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-8 font-medium">
              {tour.description ||
                `Experience the magic of ${tour.location} with this curated ${tour.days}-day escapade. Perfect for adventurers and relaxation-seekers alike, this tour offers an unforgettable journey through our most highly-rated destinations.`}
            </p>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">
              What's Included
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600 dark:text-slate-400 font-medium">
              {[
                `${tour.days - 1} Nights Accommodation`,
                "Daily Breakfast",
                "Airport Transfers",
                "Expert Local Guide",
                "All Entry Fees",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* --- REVIEWS SECTION --- */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
              Guest Reviews
            </h2>

            {/* 1. Render Existing Reviews */}
            <div className="mb-10 space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-slate-500 border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-xl font-medium">
                  Be the first to review this tour!
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/50"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar initials fallback */}
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-lg">
                          {review.user?.firstName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {review.user?.firstName} {review.user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 dark:text-slate-600"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-slate-300 font-medium leading-relaxed">
                      "{review.reviewText}"
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* 2. Write a Review Form */}
            {/* <div className="pt-8 border-t border-gray-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                <MessageSquare size={20} className="text-primary-500" /> Write a
                Review
              </h3>

              {reviewMessage.text && (
                <div
                  className={`p-4 rounded-xl mb-6 font-medium text-sm border ${
                    reviewMessage.type === "error"
                      ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800/50"
                      : "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800/50"
                  }`}
                >
                  {reviewMessage.text}
                </div>
              )} */}

              {/* <form onSubmit={handleReviewSubmit} className="space-y-6"> */}
                {/* Interactive Star Rating */}
                {/* <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Overall Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={28}
                        onClick={() => setRating(star)}
                        className={`cursor-pointer transition-colors ${
                          star <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div> */}

                {/* Review Text Area */}
                {/* <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    rows="4"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Tell others about your experience on this tour..."
                    className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg disabled:opacity-70 flex items-center gap-2"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button> */}
              {/* </form> */}
            {/* </div> */}
          </div>
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl dark:shadow-primary-900/10 border border-gray-100 dark:border-slate-800 sticky top-28 transition-colors">
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              ₹{tour.price.toLocaleString()}{" "}
              <span className="text-base font-medium text-gray-500 dark:text-slate-500">
                / person
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-gray-500 dark:text-slate-400 mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
              <Star size={14} className="text-primary-500 fill-primary-500" />{" "}
              {tour.rating || 5.0} rating
            </div>

            <form onSubmit={handleProceedToBook} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 dark:[color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Adult" : "Adults"}
                    </option>
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
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Order Summary
              </h4>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {tour.title}
                  </p>
                  <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-1">
                    <CalendarIcon size={14} /> {date} • {guests}{" "}
                    {guests === 1 ? "Guest" : "Guests"}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Total Amount
                </span>
                <span className="text-2xl font-black text-primary-600 dark:text-primary-400">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Details Form */}
            <form
              onSubmit={handlePaymentSubmit}
              className="p-6 bg-slate-50/50 dark:bg-slate-900"
            >
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Payment Details
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    disabled={isProcessing}
                    className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 font-medium"
                  />
                </div>

                {/* --- NEW CARD BRAND DROPDOWN --- */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Card Brand
                  </label>
                  <select
                    value={cardBrand}
                    onChange={(e) => setCardBrand(e.target.value)}
                    disabled={isProcessing}
                    className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 font-medium appearance-none cursor-pointer"
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Amex">American Express</option>
                    <option value="Discover">Discover</option>
                    <option value="RuPay">RuPay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400 dark:text-slate-500"
                    />
                    <input
                      type="text"
                      required
                      maxLength="19"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="0000 0000 0000 0000"
                      disabled={isProcessing}
                      className="w-full pl-10 pr-3 py-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      maxLength="5"
                      disabled={isProcessing}
                      className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      required
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, ""))
                      }
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
