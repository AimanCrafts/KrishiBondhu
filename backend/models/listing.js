const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    crop: { type: String, required: true, trim: true },
    farmer: { type: String, required: true, trim: true },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    location: { type: String, trim: true, default: "" },
    qty: { type: String, trim: true, default: "" },
    price: { type: Number, required: true, min: 0 },
    img: { type: String, trim: true, default: "" },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "sold", "removed"],
      default: "active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Listing", listingSchema);
