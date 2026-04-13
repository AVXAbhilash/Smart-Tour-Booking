import Booking from '../models/booking.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Logged in users only)
export const createBooking = async (req, res, next) => {
  try {
    

    // 1. Accept the new paymentDetails from the frontend!
    const { tour, selectedDate, guests, totalAmount, paymentDetails } = req.body;

    const booking = await Booking.create({
      bookingId: `BRK-${Date.now()}`, 
      user: req.user._id, 
      tour,
      selectedDate,
      guests,
      totalAmount,
      paymentDetails // 2. Save the safe card metadata (e.g., last 4 digits)
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
    // 3. Ensure the tour details are populated so the React UI shows images and titles
    const bookings = await Booking.find({ user: req.user._id })
      .populate('tour', 'title location image price tourId')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get ALL bookings in the system
// @route   GET /api/bookings
// @access  Private / Admin Only
export const getAllBookingsAdmin = async (req, res, next) => {
  try {
    // Populate both user and tour for the Admin Dashboard
    const bookings = await Booking.find()
      .populate('user', 'firstName email')
      .populate('tour', 'title tourId')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      message: "All system bookings retrieved successfully.",
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a booking (Used for Cancellations)
// @route   PUT /api/bookings/:id
// @access  Private (Only Booking Owner or Admin)
export const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    // 4. Safely extract the exact IDs (handling Mongoose populated objects)
    const bookingUserId = booking.user._id || booking.user;
    const loggedInUserId = req.user._id || req.user.id;
    
    // 5. DEFINE THE ROLES
    const isOwner = bookingUserId.toString() === loggedInUserId.toString();
    const isAdmin = req.user.role === 'admin';

    // SECURITY CHECK
    if (!isOwner && !isAdmin) {
      res.status(403); 
      throw new Error("You do not have permission to modify this booking.");
    }

    // Update standard fields if they were provided
    booking.selectedDate = req.body.selectedDate || booking.selectedDate;
    booking.guests = req.body.guests || booking.guests;
    booking.totalAmount = req.body.totalAmount || booking.totalAmount;
    
    // Inside controllers/bookingController.js -> updateBooking()

    // ... 6. STRICT STATUS LOGIC ...
    if (req.body.status) {
      if (isAdmin) {
        booking.status = req.body.status;
      } else if (isOwner && req.body.status === 'Cancelled') {
        booking.status = 'Cancelled';
      } else if (isOwner && req.body.status !== 'Cancelled') {
        res.status(403);
        throw new Error("Normal users are only permitted to cancel their bookings.");
      }
    }

    // ==========================================
    // 7. NEW REFUND LOGIC
    // ==========================================
    if (req.body.refundDetails) {
      // Security Check: You can only refund a Cancelled tour!
      if (booking.status !== 'Cancelled') {
        res.status(400);
        throw new Error("You can only request a refund for cancelled bookings.");
      }

      // Update the status so Admins know it needs processing
      booking.refundStatus = 'Pending';
      
      // Save the safe metadata
      booking.refundDetails = {
        cardName: req.body.refundDetails.cardName,
        cardBrand: req.body.refundDetails.cardBrand,
        // STRICT SECURITY: Slice the raw card number so only the last 4 digits are saved in MongoDB
        last4: req.body.refundDetails.cardNumber.slice(-4) || '0000'
      };
    }

    // Save and return the updated booking
    const updatedBooking = await booking.save();
// ...

    res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process/Complete a refund
// @route   PATCH /api/bookings/:id/process-refund
// @access  Private/Admin
export const processRefundAdmin = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    if (booking.refundStatus !== 'Pending') {
      res.status(400);
      throw new Error("Only pending refunds can be processed.");
    }

    // Update status to Completed
    booking.refundStatus = 'Completed';
    
    const updatedBooking = await booking.save();

    res.status(200).json({
      message: "Refund processed successfully",
      booking: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};