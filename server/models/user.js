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
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email format',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, 
    },
    phone: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      default: '', 
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
    timestamps: true, 
  }
);

// ==========================================
// SECURITY MIDDLEWARE & METHODS
// ==========================================

// --- THE FIX ---
// 1. Removed 'next' parameter.
// 2. Used 'return;' to safely exit the function if the password wasn't changed.
userSchema.pre('save', async function () {
  
  if (!this.isModified('password')) {
    return; // Safely exit without executing the code below
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 2. Instance method to compare entered password during Login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;