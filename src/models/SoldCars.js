const mongoose = require("mongoose");
import Customer from "./Customer";
import Car from "./Cars";

const soldCarSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    previousOwner: String,
    purchaser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    }, // Reference to Customer model
    purchaseDate: Date,
    purchasePrice: Number,
    salesMember: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, // Reference to Employee model
    sourceOfSelling: String, // Source of selling (e.g., OLX)
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.SoldCar || mongoose.model("SoldCar", soldCarSchema);
