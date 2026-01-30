const express = require("express");
const router = express.Router();

// GET /api/firmware/latest
router.get("/latest", (req, res) => {
  res.json({
    firmwareVersion: "0.3.7",
    binUrl: "https://smartpet-backend.onrender.com/firmware/collar_v0.3.7.bin",
    forceUpdate: false,
    notes: "Improved HR accuracy, BLE stability"
  });
});

module.exports = router;
