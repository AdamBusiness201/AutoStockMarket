const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [5, "Username must be at least 5 characters long"],
      maxlength: [20, "Username must be less than 20 characters long"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"]
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'superadmin', 'editor'],
      default: 'admin'
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    lastLogin: {
      type: Date
    }
  },
  { timestamps: true }
);



module.exports = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
