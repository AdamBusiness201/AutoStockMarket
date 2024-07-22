const mongoose = require("mongoose");
import Transaction from "./Transaction";
import Customer from "./Customer";
import Partner from "./Partner";

const invoiceSchema = new mongoose.Schema(
  {
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    customerType: {
      type: String,
      required: true,
      enum: ['Customer', 'Partner'], // Limits the value to either 'Customer' or 'Partner'
      default: 'Customer' // Set 'Customer' as the default type
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'customerType', // Dynamically determines the model to reference
    },
    invoiceDate: Date,
    totalAmount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
