const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: String,
    date: { type: Date, default: Date.now },
    amount: Number,
    remainingAmount: { type: Number },
    bank: { type: String },
    paymentMethod: { type: String },
    paidCashOrChequeNumber: { type: String },
    currency: { type: String },
    amountInWords: { type: String },
    description: String,
    partners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Partner" }],
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
