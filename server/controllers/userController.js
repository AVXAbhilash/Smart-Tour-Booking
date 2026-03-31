import User from "../models/user.js"; // Adjust path as necessary
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// --- Helper function to generate JWT ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 */
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      user: { 
        id: newUser._id, 
        fullName: newUser.fullName, 
        email: newUser.email 
      },
      token: generateToken(newUser._id), // Send token on register
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Authenticate a user (Login)
 * @route   POST /api/users/login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Send back user data and token
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      token: generateToken(user._id), // Send token on login
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


/**
 * @desc    Logout user
 * @route   POST /api/users/logout
 */
export const logoutUser = async (req, res) => {
  try {
    // Because you are sending the JWT inside the JSON response (not in HTTP-only cookies),
    // the server doesn't need to destroy anything. The frontend handles the actual token deletion.
    
    res.status(200).json({ 
      message: "Logged out successfully. Please clear the token from your frontend local storage." 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};