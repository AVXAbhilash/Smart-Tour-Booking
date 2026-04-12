import Review from '../models/review.js';
import Booking from '../models/booking.js';

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (Logged-in 'user' role only)
export const createReview = async (req, res, next) => {
  try {
    // 1. Explicitly block Admins from creating reviews
    if (req.user.role === 'admin') {
      res.status(403);
      throw new Error("Admins are not permitted to leave reviews.");
    }

    const { tour, rating, reviewText } = req.body;

    // 2. Verify the user actually booked this tour
    const booking = await Booking.findOne({ user: req.user._id, tour: tour });
    
    if (!booking) {
      res.status(400);
      throw new Error("You can only review tours you have successfully booked.");
    }

    // 3. Create the review
    const review = await Review.create({
      user: req.user._id,
      tour,
      booking: booking._id,
      rating,
      reviewText
    });

    res.status(201).json({
      message: "Review submitted successfully! Thank you for your feedback.",
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a specific tour
// @route   GET /api/reviews/tour/:tourId
// @access  Public (Anyone can see reviews on the Tour Details page)
export const getTourReviews = async (req, res, next) => {
  try {
    // req.params.tourId comes from the URL
    const reviews = await Review.find({ tour: req.params.tourId });
    
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Get ALL reviews in the system
// @route   GET /api/reviews
// @access  Private / Admin Only (For the Admin Dashboard)
export const getAllReviewsAdmin = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    
    res.status(200).json({
      message: "All system reviews retrieved successfully.",
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's reviews
// @route   GET /api/reviews/myreviews
// @access  Private
export const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id });
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review (Admin only)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReviewAdmin = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    await review.deleteOne();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
};