import express from 'express';
import { getTours, createTour } from '../controllers/tourController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTours)                 // Public: Anyone can view tours
  .post(protect, admin, createTour); // Admin Only: Create new tours

export default router;