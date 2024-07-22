const mongoose = require("mongoose");
const Admin = require("./Admin");

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: String,
    hireDate: { type: Date, default: Date.now }, // Default to current date
    salary: Number,
    benefits: String,
    contactInfo: {
      email: String,
      phone: String,
      address: String,
      nationalID: String, // Add nationalID field
      nationality: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "hold", "trainee"],
      default: "active", // Default status
    },
    statusReason: {
      type: String,
      default: "", // Default to an empty string
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
