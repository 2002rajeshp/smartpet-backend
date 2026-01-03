const mongoose = require("mongoose");

const safeZoneSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    shape: {
      type: String,
      enum: ["circle", "rectangle"],
      required: true,
    },

    center: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    // Circle
    radiusMeters: {
      type: Number,
      default: 0,
    },

    // Rectangle
    halfWidthMeters: {
      type: Number,
      default: 0,
    },
    halfHeightMeters: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SafeZone", safeZoneSchema);
