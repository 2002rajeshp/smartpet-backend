const express = require("express");
const router = express.Router();
const SafeZone = require("../models/safeZone");
const auth = require("../middleware/auth");

// 🔹 ADD SAFE ZONE
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.userId; // ✅ FIXED

    const {
      name,
      shape,
      centerLat,
      centerLng,
      radiusMeters,
      halfWidthMeters,
      halfHeightMeters,
    } = req.body;

    if (!name || !shape || !centerLat || !centerLng) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const zone = await SafeZone.create({
      userId,
      name,
      shape,
      center: { lat: centerLat, lng: centerLng },
      radiusMeters: shape === "circle" ? radiusMeters : 0,
      halfWidthMeters: shape === "rectangle" ? halfWidthMeters : 0,
      halfHeightMeters: shape === "rectangle" ? halfHeightMeters : 0,
      isActive: false,
    });

    res.status(201).json(zone);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// 🔹 GET SAFE ZONES (LOGGED-IN USER)
router.get("/", auth, async (req, res) => {
  try {
    const zones = await SafeZone.find({ userId: req.userId });
    res.json(zones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 ACTIVATE A SAFE ZONE (ONLY ONE ACTIVE PER USER)
router.put("/activate/:zoneId", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const zoneId = req.params.zoneId;

    // 1️⃣ Deactivate all zones of this user
    await SafeZone.updateMany(
      { userId },
      { isActive: false }
    );

    // 2️⃣ Activate selected zone
    const activeZone = await SafeZone.findOneAndUpdate(
      { _id: zoneId, userId },
      { isActive: true },
      { new: true }
    );

    if (!activeZone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    res.json(activeZone);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put("/deactivate/:zoneId", auth, async (req, res) => {
  try {
    const zone = await SafeZone.findOneAndUpdate(
      { _id: req.params.zoneId, userId: req.userId },
      { isActive: false },
      { new: true }
    );

    res.json(zone);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
