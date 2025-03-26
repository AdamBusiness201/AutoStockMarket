const mongoose = require("mongoose");
import Customer from './Customer';

const carSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    name: { type: String, required: true },
    color: String,
    model: String,
    chassisNumber: { type: String, unique: true, },
    engineNumber: { type: String, unique: true, },
    plateNumber: { type: String, unique: true, },
    odometerNumber: { type: String, unique: true, },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", },
    purchaseDetails: String,
    maintenance: String,
    currentLocation: String,
    entryDate: { type: Date, default: Date.now }, // Add entryDate field
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    finance: String,
    mediator: String,
    buyer: String,
    seller: String,
    additionalDetails: String
  },
  { timestamps: true }
);

module.exports = mongoose.models.Car || mongoose.model("Car", carSchema);
