const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    crop: {
      type: String,
      enum: ["rice", "wheat", "potato", "maize", "jute", "other"],
      default: "rice",
    },
    severity: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    desc: { type: String, trim: true, default: "" },
    symptoms: [{ type: String, trim: true }],
    treatment: { type: String, trim: true, default: "" },
    prevention: { type: String, trim: true, default: "" },
    img: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Disease", diseaseSchema);
