const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');

// SIGNUP
// router.post('/signup', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Fill all fields' });

//     const exists = await User.findOne({ email: email.toLowerCase() });
//     if (exists) return res.status(400).json({ success: false, message: 'Email already exists' });

//     const hashed = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email: email.toLowerCase(), password: hashed });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

//     return res.json({ success: true, message: 'User created successfully', token, user });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });


// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// router.post('/google', async (req, res) => {
//   try {
//     const { idToken } = req.body;
//     if (!idToken) {
//       return res
//         .status(400)
//         .json({ success: false, message: 'idToken is required' });
//     }

//     // 1) Verify token with Google
//     const ticket = await client.verifyIdToken({
//       idToken,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const googleId = payload.sub;      // unique Google user id
//     const email = payload.email;
//     const name = payload.name || email.split('@')[0];

//     // 2) Find or create user in our DB
//     let user = await User.findOne({ email });

//     if (!user) {
//       user = await User.create({
//         name,
//         email,
//         provider: 'google',
//         googleId,
//       });
//     }

//     // 3) Create our own JWT for the app
//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     return res.json({
//       success: true,
//       message: 'Google login successful',
//       token,
//       user,
//     });
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(500)
//       .json({ success: false, message: 'Google auth failed' });
//   }
// });



const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


router.post("/google", async (req, res) => {
  console.log("🔥🔥🔥 /api/auth/google HIT!");

  // Check received token
  console.log("Received idToken:", req.body.idToken?.substring(0, 25));

  try {
    const { idToken } = req.body;

    if (!idToken) {
      console.log("❌ No idToken received.");
      return res.status(400).json({
        success: false,
        message: "idToken is required",
      });
    }

    console.log("🔍 Verifying ID Token with Google...");
    console.log("Backend GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("✅ Google token verified. Payload email:", payload.email);

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || email.split("@")[0];

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      console.log("🆕 Creating new Google user in DB...");
      user = await User.create({
        name,
        email,
        provider: "google",
        googleId,
      });
    } else {
      console.log("👤 Existing Google user found.");
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("🎉 LOGIN SUCCESS");

    return res.json({
      success: true,
      message: "Google login successful",
      token,
      user,
    });

  } catch (err) {
    console.log("❌ GOOGLE LOGIN ERROR");
    console.error(err);

    if (err.response) {
      console.error("Google Error Response:", err.response.data);
    }

    return res.status(500).json({
      success: false,
      message: "Google auth failed",
      error: err.message,
    });
  }
});











router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Fill all fields' });

    // ---------------------------
    // PASSWORD VALIDATION
    // ---------------------------
    const capital = /^[A-Z]/.test(password);
    const special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const numbers = password.replace(/[^0-9]/g, "").length >= 2;
    const length = password.length >= 6;

    if (!capital || !special || !numbers || !length) {
      return res.status(400).json({
        success: false,
        message:
          "Password must start with Capital letter, include 1 special char, 2 numbers, and be 6+ chars long"
      });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ success: false, message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.json({ success: true, message: 'User created successfully', token, user });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});


// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Fill all fields' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Wrong password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, message: 'Login successful', token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});


// GET current user (protected)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});



module.exports = router;
