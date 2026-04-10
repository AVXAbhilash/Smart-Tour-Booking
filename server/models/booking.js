import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: [true, "A booking must have a unique bookingId"],
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A booking must belong to a user"],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "A booking must belong to a tour"],
    },
    selectedDate: {
      type: Date,
      required: [true, "A booking must have a selected date"],
    },
    guests: {
      type: Number,
      required: [true, "A booking must specify the number of guests"],
      min: [1, "There must be at least 1 guest"],
    },
    totalAmount: {
      type: Number,
      required: [true, "A booking must have a total amount"],
      min: [0, "Total amount cannot be negative"],
    },
    // Make sure it looks EXACTLY like this in Booking.js
    paymentDetails: {
      transactionId: {
        type: String,
        required: false,
      },
      cardBrand: {
        type: String,
        required: false,
      },
      last4: {
        type: String,
        required: false,
      },
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ["Pending", "Paid", "Refunded"],
        message: "Payment status is either: Pending, Paid, or Refunded",
      },
      default: "Paid",
    },
   // ... existing schema ...
    status: {
      type: String,
      enum: {
        values: ['Upcoming', 'Completed', 'Cancelled'],
        message: 'Status is either: Upcoming, Completed, or Cancelled',
      },
      default: 'Upcoming',
    },
    
    // --- NEW REFUND FIELDS ---
    refundStatus: {
      type: String,
      enum: {
        values: ['Not Eligible', 'Pending', 'Completed'],
        message: 'Refund status is either: Not Eligible, Pending, or Completed',
      },
      default: 'Not Eligible', // Default until they cancel and request it
    },
    refundDetails: {
      cardName: String,
      cardBrand: String,
      last4: String // We only store the last 4 digits for PCI-DSS security!
    }
    // -------------------------
  },
  {
    timestamps: true,
  }
);
// ... rest of file stays the same

// ==========================================
// 1. AUTO-STATUS CALCULATOR (THE NEW LOGIC)
// ==========================================
// FIX: Removed 'next' from the function parameters entirely!
bookingSchema.pre("save", function () {
  // Only calculate this if the booking is new OR if the date was just changed
  if (this.isNew || this.isModified("selectedDate")) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight so we strictly compare the day

    const bookingDate = new Date(this.selectedDate);

    // If the date is in the past, and it hasn't been cancelled, force it to 'Completed'
    if (bookingDate < today && this.status !== "Cancelled") {
      this.status = "Completed";
    } else if (bookingDate >= today && this.status === "Completed") {
      // Just in case someone tries to create a future booking marked as completed
      this.status = "Upcoming";
    }
  }
  // FIX: Deleted the next() call! Mongoose handles this automatically now.
});

// ==========================================
// 2. AUTO-POPULATE DATA
// ==========================================
bookingSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "firstName email",
  }).populate({
    path: "tour",
    select: "title location image price tourId",
  });
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
