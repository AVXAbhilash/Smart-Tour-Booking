import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  logoutUser // <-- 1. Import the new controller
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser); // <-- 2. Add the logout route

router.route('/profile').get(protect, getUserProfile);

export default router;