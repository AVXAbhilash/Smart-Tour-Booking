import Tour from '../models/tour.js';

// @desc    Get all tours
// @route   GET /api/tours
// @access  Public
export const getTours = async (req, res, next) => {
  try {
    // You can add filtering here later (e.g., req.query to search by location)
    const tours = await Tour.find();
    res.status(200).json(tours);
  } catch (error) {
    next(error); // Passes the error to errorMiddleware
  }
};

// @desc    Create a new tour
// @route   POST /api/tours
// @access  Private/Admin
export const createTour = async (req, res, next) => {
  try {
    // Generate a unique tourId if not provided by the frontend
    const tourData = {
      ...req.body,
      tourId: req.body.tourId || `TR-${Math.floor(Math.random() * 10000)}`
    };
    
    const tour = await Tour.create(tourData);
    res.status(201).json(tour);
  } catch (error) {
    next(error);
  }
};