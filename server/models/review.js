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
    timestamps: true,
  }
);

// --- THE FIX: STRICT COMPOUND INDEX ---
// Prevents a user from reviewing the SAME tour multiple times across different bookings.
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
// --------------------------------------

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'firstName lastName' 
  }).populate({
    path: 'tour',
    select: 'title' 
  });
});

// ==========================================
// DYNAMIC RATING CALCULATOR
// ==========================================
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }, 
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 }, 
        avgRating: { $avg: '$rating' }, 
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model('Tour').findByIdAndUpdate(tourId, {
      numReviews: stats[0].nRating,
      rating: Math.round(stats[0].avgRating * 10) / 10, 
    });
  } else {
    await mongoose.model('Tour').findByIdAndUpdate(tourId, {
      numReviews: 0,
      rating: 5.0, 
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;