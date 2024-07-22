const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    cost: Number,
    // Assuming a service can be applied to many cars - Many-to-Many relationship
    // This relationship could alternatively be managed in the Car schema or a separate associative collection
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
