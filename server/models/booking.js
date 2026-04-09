import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: [true, 'A booking must have a unique bookingId'],
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User', // Must match the name you used in mongoose.model('User', ...)
      required: [true, 'A booking must belong to a user'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour', // Must match the name you used in mongoose.model('Tour', ...)
      required: [true, 'A booking must belong to a tour'],
    },
    selectedDate: {
      type: Date,
      required: [true, 'A booking must have a selected date'],
    },
    guests: {
      type: Number,
      required: [true, 'A booking must specify the number of guests'],
      min: [1, 'There must be at least 1 guest'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'A booking must have a total amount'],
      min: [0, 'Total amount cannot be negative'],
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['Pending', 'Paid', 'Refunded'],
        message: 'Payment status is either: Pending, Paid, or Refunded',
      },
      default: 'Paid',
    },
    status: {
      type: String,
      enum: {
        values: ['Upcoming', 'Completed', 'Cancelled'],
        message: 'Status is either: Upcoming, Completed, or Cancelled',
      },
      default: 'Upcoming',
    },
  },
  {
    timestamps: true,
  }
);

// --- THE FIX IS RIGHT HERE ---
// Removed 'next' from the function parameters and deleted the 'next()' call.
// Mongoose handles this automatically for .populate() now!
bookingSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'firstName email', // <-- Changed fullName to firstName based on your User model!
  }).populate({
    path: 'tour',
    select: 'title location image price',
  });
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;