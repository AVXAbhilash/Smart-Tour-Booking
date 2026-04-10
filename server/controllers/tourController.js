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

// ... existing getTours and createTour functions ...

// @desc    Get single tour by custom tourId
// @route   GET /api/tours/:id
// @access  Public
export const getTourById = async (req, res, next) => {
  try {
    // We use findOne to search specifically by your custom 'tourId' field
    // req.params.id will be whatever is in the URL (e.g., 'TR-101')
    const tour = await Tour.findOne({ tourId: req.params.id });

    if (tour) {
      res.status(200).json(tour);
    } else {
      res.status(404);
      throw new Error("Tour not found");
    }
  } catch (error) {
    next(error);
  }
};