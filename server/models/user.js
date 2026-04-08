import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please add a first name'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Please add a last name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true, // Forces emails to lowercase to prevent duplicate registrations (e.g. Abhi@... vs abhi@...)
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email format',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Security feature: Prevents the password from being returned in standard DB queries
    },
    phone: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      default: '', // You can replace this with a default avatar URL later
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be either user or admin',
      },
      default: 'user',
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt
  }
);

// ==========================================
// SECURITY MIDDLEWARE & METHODS
// ==========================================

// 1. Hash the password before saving to the database
userSchema.pre('save', async function (next) {
  // If the password hasn't been modified (e.g., user is just updating their phone number), skip hashing
  if (!this.isModified('password')) {
    next();
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 2. Instance method to compare entered password during Login
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Compares the plain text password from the frontend to the hashed one in the database
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;