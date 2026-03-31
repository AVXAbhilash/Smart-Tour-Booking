import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    // phoneNumber:{
    //     type:Number,
    //     required:true,
    //     validate: {
    //     validator: function (v) {
    //       // Indian phone number validation (10 digits, starts with 6-9)
    //       return /^[6-9]\d{9}$/.test(v);
    //     },
    //     message: props => `${props.value} is not a valid phone number!`
    //   }
    // },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;