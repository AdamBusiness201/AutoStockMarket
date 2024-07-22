// bonus.js
const mongoose = require("mongoose");

const bonusSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    amount: Number,
    reason: String,
    dateReceived: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Bonus || mongoose.model("Bonus", bonusSchema);
