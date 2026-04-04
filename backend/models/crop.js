const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["grain", "vegetable", "fruit", "cash", "pulse"],
      default: "grain",
    },
    season: {
      type: String,
      enum: ["kharif", "rabi", "yearround"],
      default: "kharif",
    },
    region: { type: String, trim: true, default: "" },
    period: { type: String, trim: true, default: "" },
    desc: { type: String, trim: true, default: "" },
    img: { type: String, trim: true, default: "" },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Crop", cropSchema);
