import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema(
  {
    // Note: Mongoose automatically creates the _id (ObjectId) field, 
    // so you don't need to explicitly define it here.

    tourId: {
      type: String,
      required: [true, 'A tour must have a unique custom tourId'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'A tour must have a title'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'A tour must have a location'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'A tour must have a type (e.g., Mountain Treks)'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
      min: [0, 'Price cannot be negative'],
    },
    days: {
      type: Number,
      required: [true, 'A tour must specify the number of days'],
      min: [1, 'A tour must be at least 1 day long'],
    },
    description: {
      type: String,
      trim: true,
    },
    includedItems: {
      type: [String], // Array of strings
      default: [],
    },
    image: {
      type: String, // URL string
      required: [true, 'A tour must have an image'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be above or equal to 0'],
      max: [5, 'Rating must be below or equal to 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    // This automatically handles the "createdAt" (and adds an "updatedAt") field for you!
    timestamps: true, 
  }
);

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;