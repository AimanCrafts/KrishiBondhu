const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    bio: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    img: { type: String, trim: true, default: "" },
    institution: { type: String, trim: true, default: "" },
    experience: { type: String, trim: true, default: "" },
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expert", expertSchema);
