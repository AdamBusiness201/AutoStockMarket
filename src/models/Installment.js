const mongoose = require("mongoose");

const installmentSchema = new mongoose.Schema(
  {
    installmentDate: { type: Date, default: new Date},
    amount: { type: Number, required: true },
    description: String,
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    paid: { type: Boolean, default: true }, // Indicates whether the installment has been paid
  },
  { timestamps: true }
);

module.exports = mongoose.models.Installment || mongoose.model("Installment", installmentSchema);
