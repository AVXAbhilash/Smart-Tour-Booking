import Review from '../models/review.js';
import Booking from '../models/booking.js';

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { tour, rating, reviewText } = req.body;

    // 1. Verify the user actually booked this tour
    const booking = await Booking.findOne({ user: req.user._id, tour: tour });
    
    if (!booking) {
      res.status(400);
      throw new Error("You can only review tours you have successfully booked.");
    }

    // 2. Create the review
    const review = await Review.create({
      user: req.user._id,
      tour,
      booking: booking._id,
      rating,
      reviewText
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};