const mongoose = require("mongoose");

const marketPriceSchema = new mongoose.Schema(
  {
    cropName: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    unit: { type: String, default: "kg", trim: true },
    market: { type: String, trim: true, default: "" },
    change: { type: String, trim: true, default: "" },
    up: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MarketPrice", marketPriceSchema);
