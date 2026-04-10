import express from 'express';
import { 
  createReview, 
  getTourReviews, 
  getAllReviewsAdmin,
  getMyReviews
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ==========================================
// ROOT ROUTES (/api/reviews)
// ==========================================
router.route('/')
  // POST: Logged-in users can create reviews (Admins are blocked inside the controller)
  .post(protect, createReview)
  
  // GET: Only Admins can view the master list of all reviews
  .get(protect, admin, getAllReviewsAdmin);

// ==========================================
// PUBLIC ROUTES (/api/reviews/tour/:tourId)
// ==========================================
// GET: Anyone (even not logged in) can see reviews for a specific tour
router.route('/tour/:tourId').get(getTourReviews);
// Add this right BEFORE the /tour/:tourId route:
router.route('/myreviews').get(protect, getMyReviews);

export default router;