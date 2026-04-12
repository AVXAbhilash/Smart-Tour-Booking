import express from 'express';
// 1. Add deleteTour to your imports
import { getTours, createTour, getTourById, updateTour, deleteTour } from '../controllers/tourController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTours)                 
  .post(protect, admin, createTour); 

router.route('/:id')
  .get(getTourById)              
  .put(protect, admin, updateTour)  
  .delete(protect, admin, deleteTour); // 2. Add the DELETE method here!

export default router;