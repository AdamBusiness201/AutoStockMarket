const mongoose = require("mongoose");

const deductionSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    amount: { type: Number, required: true },
    reason: String,
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Deduction || mongoose.model("Deduction", deductionSchema);
