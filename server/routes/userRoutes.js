import express from 'express';
import { 
  registerUser, 
  loginUser, 
  logoutUser,
  getUserProfile, 
  updateUserProfile,    // <-- Import the new controller
  updateUserPassword    // <-- Import the new controller
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

// Protected Routes (Must be logged in)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile); // <-- Added PUT route

// Password update gets its own specific endpoint
router.put('/password', protect, updateUserPassword); // <-- Added Password route

export default router;