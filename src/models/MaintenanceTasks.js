const mongoose = require("mongoose");
import Customer from './Customer'
import Car from './Cars'

const maintenanceTaskSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car" // Reference to Car model
    },
    externalCarDetails: {
      // Store details of non-existing car
      type: {
        name: String,
        color: String,
        model: String,
        chassisNumber: String,
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Customer" // Reference to Customer model
        },
      },
      default: null
    },
    taskDescription: String,
    taskDate: Date,
    taskCost: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.models.MaintenanceTask || mongoose.model("MaintenanceTask", maintenanceTaskSchema);
