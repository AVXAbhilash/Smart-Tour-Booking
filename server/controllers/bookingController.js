import Booking from '../models/booking.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Logged in users only)
export const createBooking = async (req, res, next) => {
  try {
    const { tour, selectedDate, guests, totalAmount } = req.body;

    const booking = await Booking.create({
      bookingId: `BRK-${Date.now()}`, // Auto-generate a unique booking ID
      user: req.user._id, // Comes from your protect middleware!
      tour,
      selectedDate,
      guests,
      totalAmount
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};