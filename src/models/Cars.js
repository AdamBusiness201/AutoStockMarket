const mongoose = require("mongoose");
import Customer from './Customer';

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    color: String,
    model: String,
    chassisNumber: { type: String, unique: true, required: true },
    engineNumber: { type: String, unique: true, required: true },
    plateNumber: { type: String, unique: true, required: true },
    odometerNumber: { type: String, unique: true, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    purchaseDetails: String,
    maintenance: String,
    currentLocation: String,
    entryDate: { type: Date, default: Date.now }, // Add entryDate field
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Car || mongoose.model("Car", carSchema);
