// backend/models/order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    farmerName: { type: String, trim: true, default: "" },
    farmerLocation: { type: String, trim: true, default: "" },

    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      default: null,
    },

    crop: { type: String, required: true, trim: true },

    qtyKg: { type: Number, required: true, min: 1 },

    pricePerKg: { type: Number, required: true, min: 0 },

    totalAmount: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["pending", "confirmed", "in_transit", "delivered", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },

    deliveryDate: { type: Date, default: null },

    note: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

// Auto-generate order number before save
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD-${String(count + 1000).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
