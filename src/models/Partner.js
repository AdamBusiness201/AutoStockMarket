const mongoose = require("mongoose");

// Define the schema for the Partner model
const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Remove whitespace from both ends of the string
    },
    type: {
      type: String,
      enum: ["Supplier", "Partner", "Other"], // Enumerate possible values
      default: "Partner", // Default value if not provided
    },
    contactInfo: {
      email: {
        type: String,
        lowercase: true, // Convert email to lowercase
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], // Validate email format
      },
      phone: {
        type: String,
        trim: true,
      },
      address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        zipCode: { type: String, trim: true },
      },
    },
    partnershipPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    cars: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }], // Reference to Car model
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Export the Partner model
module.exports =
  mongoose.models.Partner || mongoose.model("Partner", partnerSchema);
