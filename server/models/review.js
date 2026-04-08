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

// DOCUMENT MIDDLEWARE: Auto-populate user details for the frontend UI
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'fullName' // Only fetch the reviewer's name to display next to their comment
  }).populate({
    path: 'tour',
    select: 'title' // Helpful for the Admin dashboard when viewing all reviews
  });
  
  next();
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;