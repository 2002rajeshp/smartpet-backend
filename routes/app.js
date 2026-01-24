const express = require("express");
const router = express.Router();

// GET /api/app/version
router.get("/version", (req, res) => {
  res.json({
    latestVersion: "1.0.1",
    apkUrl: "https://smartpet-backend.onrender.com/apk/my_app_v1.0.1.apk",
    forceUpdate: false,
    releaseNotes: "UI changes, bug fixes, performance improvements"
  });
});

module.exports = router;
