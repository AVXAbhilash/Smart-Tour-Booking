import express from 'express';
import { 
  createReview, 
  getTourReviews, 
  getAllReviewsAdmin,
  getMyReviews,
  deleteReviewAdmin // <-- 1. Added the delete import!
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ==========================================
// ROOT ROUTES (/api/reviews)
// ==========================================
router.route('/')
  // POST: Logged-in users can create reviews
  .post(protect, createReview)
  // GET: Only Admins can view the master list of all reviews
  .get(protect, admin, getAllReviewsAdmin);

// ==========================================
// USER SPECIFIC ROUTES
// ==========================================
// GET: Logged in user can view their own reviews
// (Must be above /:id so Express doesn't think "myreviews" is an ID!)
router.route('/myreviews')
  .get(protect, getMyReviews);

// ==========================================
// TOUR SPECIFIC ROUTES 
// ==========================================
// GET: Anyone can see reviews for a specific tour
router.route('/tour/:tourId')
  .get(getTourReviews);

// ==========================================
// ADMIN MANAGEMENT ROUTES 
// ==========================================
// DELETE: Only Admins can delete a review by its ID
router.route('/:id')
  .delete(protect, admin, deleteReviewAdmin); // <-- 2. Added the delete route!

export default router;