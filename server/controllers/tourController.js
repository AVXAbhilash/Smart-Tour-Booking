import Tour from '../models/tour.js';

// @desc    Get all tours
// @route   GET /api/tours
// @access  Public
export const getTours = async (req, res, next) => {
  try {
    const tours = await Tour.find();
    res.status(200).json(tours);
  } catch (error) {
    next(error); 
  }
};

// @desc    Create a new tour
// @route   POST /api/tours
// @access  Private/Admin
export const createTour = async (req, res, next) => {
  try {
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

// @desc    Get single tour by ID or TourID
// @route   GET /api/tours/:id
export const getTourById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let tour;

    // Check if the ID provided is a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      tour = await Tour.findById(id);
    } else {
      // If not an ObjectId, search by the custom tourId (e.g., TR-6417)
      tour = await Tour.findOne({ tourId: id });
    }

    if (!tour) {
      res.status(404);
      throw new Error("Tour package not found");
    }

    res.json(tour);
  } catch (error) {
    next(error);
  }
};

// ==========================================
// NEW: UPDATE TOUR FUNCTION
// ==========================================
// @desc    Update a tour
// @route   PUT /api/tours/:id
// @access  Private/Admin
export const updateTour = async (req, res, next) => {
  try {
    // 1. Find the tour and update it simultaneously based on the TR-101 ID
    // { new: true } tells Mongoose to return the UPDATED document, not the old one
    // { runValidators: true } ensures the new data still follows your Schema rules
    const updatedTour = await Tour.findOneAndUpdate(
      { tourId: req.params.id }, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (updatedTour) {
      res.status(200).json({
        message: "Tour updated successfully",
        tour: updatedTour
      });
    } else {
      res.status(404);
      throw new Error("Tour not found. Cannot update.");
    }
  } catch (error) {
    next(error);
  }
};


// ... existing getTours, createTour, getTourById, updateTour functions ...

// ==========================================
// NEW: DELETE TOUR FUNCTION
// ==========================================
// @desc    Delete a tour
// @route   DELETE /api/tours/:id
// @access  Private/Admin
export const deleteTour = async (req, res, next) => {
  try {
    // Find the tour by its MongoDB _id and remove it from the database
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (tour) {
      res.status(200).json({ 
        message: "Tour successfully deleted",
        id: req.params.id 
      });
    } else {
      res.status(404);
      throw new Error("Tour not found. It may have already been deleted.");
    }
  } catch (error) {
    next(error);
  }
};