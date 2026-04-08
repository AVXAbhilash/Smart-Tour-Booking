import User from '../models/user.js';
import jwt from 'jsonwebtoken';

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    // 1. Destructure 'role' from req.body
    const { firstName, lastName, email, password, phone, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // 2. Add 'role' to the create object
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || 'user' // Default to 'user' if role isn't provided
    });

    if (user) {
      res.status(201).json({
        message: "Registration successful! Welcome aboard.",
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role, // This will now show 'admin' in the response
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly select the password field since we hid it in the model
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        message: "Login successful! Welcome back.", // <-- Added message
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear token
// @route   GET /api/users/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.status(200).json({ 
    message: "Logged out successfully. See you next time!" // <-- Streamlined message
  });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    // req.user is populated by your protect middleware
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        message: "Profile data retrieved successfully.", // <-- Added message
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};