import express from 'express';
import { 
  createBooking, 
  getMyBookings, 
  getAllBookingsAdmin,
  updateBooking
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require user to be logged in for ALL booking routes below this line
router.use(protect); 

// Root route handles both creating a booking and fetching the admin master list
router.route('/')
  .post(createBooking)                 // Any logged-in user can book
  .get(admin, getAllBookingsAdmin);    // ONLY logged-in admins can view all

router.route('/mybookings').get(getMyBookings);



// --- NEW ROUTE ---
// Target a specific booking by ID to update it
router.route('/:id')
  .put(updateBooking); // Protect is already applied via router.use(protect) above

export default router;  