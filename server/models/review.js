import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour'],
    },
    booking: {
      type: mongoose.Schema.ObjectId,
      ref: 'Booking',
      required: [true, 'A review must be linked to a specific booking to verify attendance'],
      // By setting this to unique, you guarantee that a user can only leave ONE review per booking.
      unique: true, 
    },
    rating: {
      type: Number,
      required: [true, 'A review must have a rating'],
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating cannot exceed 5.0'],
    },
    reviewText: {
      type: String,
      required: [true, 'A review cannot be empty'],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt
  }
);

// OPTIONAL BUT RECOMMENDED: Prevent a user from reviewing the SAME tour multiple times 
// across different bookings (if that fits your business logic).
// reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// --- THE FIX ---
// Removed 'next' parameter and the 'next()' call. 
// Also updated 'fullName' to 'firstName lastName' to match your User schema!
reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'firstName lastName' // Fetch the reviewer's real name fields to display next to their comment
  }).populate({
    path: 'tour',
    select: 'title' // Helpful for the Admin dashboard when viewing all reviews
  });
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;