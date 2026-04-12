// backend/models/notification.js

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
   
    audience: {
      type: String,
      enum: ["all", "farmers", "business"],
      default: "farmers",
    },

    type: {
      type: String,
      enum: ["new_crop", "new_disease", "status_change", "alert", "general"],
      default: "general",
    },

    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },

    
    link: { type: String, default: "" },

    
    refId: { type: String, default: "" },

    
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
