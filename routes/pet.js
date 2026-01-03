const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Pet = require("../models/pet");
const User = require("../models/user"); 
const multer = require("multer");
const cloudinary = require("../config/cloudinary");


// store image in memory before upload
const storage = multer.memoryStorage();
const upload = multer({ storage });


// AUTH MIDDLEWARE
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}


// Save Pet Profile
// router.post("/save", async (req, res) => {
//   try {
//     const {
//       userId,
//       name,
//       petType,
//       breed,
//       gender,
//       birthday,
//       weight,
//       photoUrl
//     } = req.body;

//     const pet = new Pet({
//       userId,
//       name,
//       petType,
//       breed,
//       gender,
//       birthday,
//       weight,
//       photoUrl
//     });

//     await pet.save();

//     res.json({
//       success: true,
//       message: "Pet profile saved successfully!",
//       pet
//     });

//   } catch (err) {
//     console.error("Error saving pet:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// router.post("/save", upload.single("photo"), async (req, res) => {
//   try {
//     let photoUrl = "";

//     // -----------------------------
//     // 1️⃣ Upload the image to Cloudinary (proper async Promise)
//     // -----------------------------
//     if (req.file) {
//       const uploaded = await new Promise((resolve, reject) => {
//         cloudinary.uploader.upload_stream(
//           { folder: "smartpet" },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         ).end(req.file.buffer);
//       });

//       photoUrl = uploaded.secure_url;
//       console.log("Cloudinary Upload URL:", photoUrl);
//     }

//     // -----------------------------
//     // 2️⃣ Save pet in MongoDB
//     // -----------------------------
//     const pet = await Pet.create({
//       userId: req.body.userId,
//       name: req.body.name,
//       petType: req.body.petType,
//       breed: req.body.breed,
//       gender: req.body.gender,
//       birthday: req.body.birthday,
//       weight: req.body.weight,
//       photoUrl: photoUrl, // <--- NOW CORRECT!
//     });

//     return res.json({ success: true, pet });

//   } catch (err) {
//     console.error("❌ Error saving pet:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });
// SAVE PET WITHOUT PHOTO
// router.post("/save", async (req, res) => {
//   try {
//     const pet = await Pet.create({
//       userId: req.body.userId,
//       name: req.body.name,
//       petType: req.body.petType,
//       breed: req.body.breed,
//       gender: req.body.gender,
//       birthday: req.body.birthday,
//       weight: req.body.weight,
//       photoUrl: "",   // empty for now
//     });

//     res.json({ success: true, pet });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // UPDATE PHOTO URL LATER
// router.post("/updatePhoto", async (req, res) => {
//   try {
//     const { petId, photoUrl } = req.body;

//     const pet = await Pet.findByIdAndUpdate(
//       petId,
//       { photoUrl },
//       { new: true }
//     );

//     res.json({ success: true, pet });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });
// SAVE PET PROFILE (FAST)
router.post("/save", async (req, res) => {
  try {
    const pet = await Pet.create({
      userId: req.body.userId,
      name: req.body.name,
      petType: req.body.petType,
      breed: req.body.breed,
      gender: req.body.gender,
      birthday: new Date(req.body.birthday), // ✅ FIX
      weight: req.body.weight,
      photo: "", // ✅ FIX: consistent field name
    });

    res.json({ success: true, pet });
  } catch (err) {
    console.error("❌ Save pet error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


// UPDATE PHOTO URL LATER (BACKGROUND)
// router.post("/updatePhoto", async (req, res) => {
//   try {
//     const { petId, photoUrl } = req.body;

//     if (!petId || !photoUrl) {
//       return res.status(400).json({
//         success: false,
//         message: "petId and photoUrl required",
//       });
//     }

//     const pet = await Pet.findByIdAndUpdate(
//       petId,
//       { photo: photoUrl }, // ✅ FIX
//       { new: true }
//     );

//     if (!pet) {
//       return res.status(404).json({
//         success: false,
//         message: "Pet not found",
//       });
//     }

//     res.json({ success: true, pet });
//   } catch (err) {
//     console.error("❌ Update photo error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });


// router.post("/updatePhoto", async (req, res) => {
//   try {
//     const { petId, photoUrl } = req.body;

//     const pet = await Pet.findByIdAndUpdate(
//       petId,
//       { photoUrl },
//       { new: true }
//     );

//     res.json({ success: true, pet });
//   } catch (err) {
    
//   }
// });

router.post("/updatePhoto", async (req, res) => {
  try {
    const { petId, photoUrl } = req.body;

    if (!petId || !photoUrl) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const pet = await Pet.findByIdAndUpdate(
      petId,
      { photoUrl },
      { new: true }
    );

    if (!pet) {
      return res.status(404).json({ success: false, message: "Pet not found" });
    }

    res.json({ success: true, pet });
  } catch (err) {
    console.log("Update Photo Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


// CHECK IF USER HAS A PET PROFILE
router.get("/check/:userId", async (req, res) => {
  try {
    const pet = await Pet.findOne({ userId: req.params.userId });

    if (!pet) {
      return res.json({ exists: false });
    }

    return res.json({ exists: true, pet });
  } catch (err) {
    console.error("Error checking pet:", err);
    res.status(500).json({ exists: false });
  }
});



// router.get("/profile/:userId", async (req, res) => {
//   const pet = await Pet.findOne({ userId: req.params.userId });
//   const user = await User.findById(req.params.userId);
//   res.json({ success: true, pet, user });
// });
router.get("/profile/:userId", async (req, res) => {
  try {
    const pet = await Pet.findOne({ userId: req.params.userId });
    const user = await User.findById(req.params.userId);

    res.json({ success: true, pet, user });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// router.post("/updateProfile", async (req, res) => {
//   const { petId, name, breed, weight } = req.body;

//   const updated = await Pet.findByIdAndUpdate(
//     petId,
//     { name, breed, weight },
//     { new: true }
//   );

//   res.json({ success: true, pet: updated });
// });

// // 🔥 Upload buffer to Cloudinary
// function uploadToCloudinary(buffer) {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload_stream(
//       { folder: "smartpet" },
//       (error, result) => {
//         if (error) {
//           console.log("Cloudinary upload error:", error);
//           reject(error);
//         } else {
//           resolve(result.secure_url);
//         }
//       }
//     ).end(buffer);
//   });
// }




// PUT: Update ONLY pet photo
router.put("/updatePhoto/:petId", upload.single("photo"), async (req, res) => {
  try {
    const petId = req.params.petId;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder: "smartpet/pets",
    });

    const pet = await Pet.findByIdAndUpdate(
      petId,
      { photoUrl: uploaded.secure_url },
      { new: true }
    );

    res.json({ success: true, pet });
  } catch (err) {
    console.error("Update Photo Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


router.put("/updateText/:petId", async (req, res) => {
  try {
    const petId = req.params.petId;

    const updateData = {
      name: req.body.name,
      breed: req.body.breed,
      weight: req.body.weight,
      birthday: req.body.birthday,
    };

    const pet = await Pet.findByIdAndUpdate(petId, updateData, { new: true });

    res.json({ success: true, pet });
  } catch (err) {
    console.log("Update text error:", err);
    res.status(500).json({ success: false });
  }
});




// Update BLE Connected / Not Connected
router.post("/ble", authMiddleware, async (req, res) => {
  const { connected } = req.body;

  const pet = await Pet.findOneAndUpdate(
    { userId: req.userId },
    { bleConnected: connected },
    { new: true, upsert: true }
  );

  res.json({ success: true, pet });
});

// Dashboard Info
// router.get("/dashboard", authMiddleware, async (req, res) => {
//   const pet = await Pet.findOne({ userId: req.userId }).lean();
//   res.json({ success: true, pet });
// });

// router.get("/dashboard", authMiddleware, async (req, res) => {
//   try {
//     const pet = await Pet.findOne({ userId: req.userId }).lean();

//     if (!pet) {
//       return res.json({
//         success: true,
//         pet: null,
//       });
//     }

//     res.json({
//       success: true,
//       pet: {
//         _id: pet._id,
//         name: pet.name,
//         breed: pet.breed,
//         birthday: pet.birthday,
//         weight: pet.weight,
//         photoUrl: pet.photoUrl,
//         bleConnected: pet.bleConnected ?? false,
//       },
//     });
//   } catch (err) {
//     console.error("Dashboard error:", err);
//     res.status(500).json({ success: false });
//   }
// });



router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    // 🔹 Get logged-in user
    const user = await User.findById(req.userId)
      .select("name email")
      .lean();

    // 🔹 Get pet for this user
    const pet = await Pet.findOne({ userId: req.userId }).lean();

    return res.json({
      success: true,

      // ✅ USER INFO (IMPORTANT)
      user: user
        ? {
            _id: user._id,
            name: user.name,
            email: user.email,
          }
        : null,

      // ✅ PET INFO
      pet: pet
        ? {
            _id: pet._id,
            name: pet.name,
            breed: pet.breed,
            birthday: pet.birthday,
            weight: pet.weight,
            photoUrl: pet.photoUrl,
            bleConnected: pet.bleConnected ?? false,
          }
        : null,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;


module.exports = router;
