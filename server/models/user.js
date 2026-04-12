import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; // <-- 1. Import crypto

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
    // <-- 2. ADD THESE TWO NEW FIELDS -->
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true, 
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return; 
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// <-- 3. ADD THIS NEW METHOD TO GENERATE THE TOKEN -->
userSchema.methods.getResetPasswordToken = function () {
  // Generate a random token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash it and set it to the resetPasswordToken field in the database
  // We hash it in the DB so if your DB is ever hacked, the hackers can't use the tokens!
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expiration to 10 minutes from now
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // Return the UNHASHED token to send to the user's email
  return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;