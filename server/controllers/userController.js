import User from "../models/user.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto';

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || "user",
    });

    if (user) {
      res.status(201).json({
        message: "Registration successful! Welcome aboard.",
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
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

    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      res.json({
        message: "Login successful! Welcome back.",
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
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
    message: "Logged out successfully. See you next time!",
  });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        message: "Profile data retrieved successfully.",
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile data
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.profileImage = req.body.profileImage || user.profileImage;

      const updatedUser = await user.save();

      res.json({
        message: "Profile updated successfully.",
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profileImage: updatedUser.profileImage,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
export const updateUserPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (user) {
      const isMatch = await user.matchPassword(currentPassword);

      if (!isMatch) {
        res.status(401);
        throw new Error("Incorrect current password.");
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: "Password updated successfully." });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN CONTROLLERS 
// ==========================================

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsersAdmin = async (req, res, next) => {
  try {
    // Exclude password from the query for security, sort newest first
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new user (Allows setting Role)
// @route   POST /api/users
// @access  Private/Admin
export const createUserAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists with that email");
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'user'
    });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUserAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Safety check: Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error("You cannot delete your own account");
    }

    await user.deleteOne();
    res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate and send forgot password token
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(404);
      throw new Error("There is no user with that email");
    }

    // Get the unhashed reset token
    const resetToken = user.getResetPasswordToken();

    // Save the hashed token and expiration to the database
    // { validateBeforeSave: false } skips the required password check
    await user.save({ validateBeforeSave: false });

    // Create the reset URL pointing to your React frontend
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // FOR DEVELOPMENT: Log it to the console so you can click it!
    console.log(`\n=== PASSWORD RESET LINK ===\n${resetUrl}\n===========================\n`);

    res.status(200).json({
      message: "Password reset link generated. Check your server console!",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   PUT /api/users/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    // 1. Get the hashed token from the URL params to match what's in the database
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // 2. Find the user with this token, and make sure it hasn't expired yet
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // $gt means "greater than" right now
    });

    if (!user) {
      res.status(400);
      throw new Error("Invalid or expired token");
    }

    // 3. Set the new password
    user.password = req.body.password;

    // 4. Clear out the reset token fields so they can't be used again
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // 5. Save the user (this will trigger your bcrypt pre('save') hook automatically!)
    await user.save();

    res.status(200).json({
      message: "Password reset successful. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};