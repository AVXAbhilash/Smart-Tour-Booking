import express from 'express';
import { createBooking, getMyBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require user to be logged in for all booking routes
router.use(protect); 

router.route('/').post(createBooking);
router.route('/mybookings').get(getMyBookings);

export default router;