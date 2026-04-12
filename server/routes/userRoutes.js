import express from 'express';
import { 
  registerUser, 
  loginUser, 
  logoutUser,
  getUserProfile, 
  updateUserProfile,    
  updateUserPassword,
  getUsersAdmin,        // <-- New Admin Import
  createUserAdmin,      // <-- New Admin Import
  deleteUserAdmin,       // <-- New Admin Import
  forgotPassword,     // <-- 1. Import new controller
  resetPassword
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; // <-- Added 'admin'

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

// <-- 3. ADD THE TWO NEW ROUTES HERE -->
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// ==========================================
// PROTECTED USER ROUTES
// ==========================================
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile); 

router.put('/password', protect, updateUserPassword); 

// ==========================================
// PROTECTED ADMIN ROUTES
// ==========================================
// Get all users OR Create a new user
router.route('/')
  .get(protect, admin, getUsersAdmin)
  .post(protect, admin, createUserAdmin);

// Delete a specific user
router.route('/:id')
  .delete(protect, admin, deleteUserAdmin);

export default router;