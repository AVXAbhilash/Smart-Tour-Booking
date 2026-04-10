import express from 'express';
// 1. Added getTourById to the import list!
import { getTours, createTour, getTourById } from '../controllers/tourController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTours)                 // Public: Anyone can view tours
  .post(protect, admin, createTour); // Admin Only: Create new tours

// 2. Added the specific route to catch individual tour IDs (like TR-101)
router.route('/:id')
  .get(getTourById);             // Public: Anyone can view a specific tour's details

export default router;