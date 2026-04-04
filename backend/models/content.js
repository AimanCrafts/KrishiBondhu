const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: String, default: "" },
    type: { type: String, enum: ["image", "text"], default: "text" },
    label: { type: String, trim: true, default: "" },
    desc: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Content", contentSchema);
