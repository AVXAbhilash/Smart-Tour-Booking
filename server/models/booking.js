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

// DOCUMENT MIDDLEWARE: Auto-populate user and tour details when querying bookings
bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'fullName email' // Only fetch the fields you need
  }).populate({
    path: 'tour',
    select: 'title location image price' 
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;