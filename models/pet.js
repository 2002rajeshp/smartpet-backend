// const mongoose = require("mongoose");

// const petSchema = new mongoose.Schema({
//   userId: mongoose.Types.ObjectId,
//   petName: { type: String, default: "My Pet" },
//   bleConnected: { type: Boolean, default: false }
// });

// module.exports = mongoose.model("Pet", petSchema);

// const mongoose = require("mongoose");

// const petSchema = new mongoose.Schema({
//   userId: { type: String, required: true },

//   name: { type: String, required: true },
//   petType: { type: String, required: true },
//   breed: { type: String },
//   gender: { type: String },
//   birthday: { type: Date },
//   weight: { type: Number },

//   photoUrl: { type: String }, // uploaded image link

//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Pet", petSchema);

const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: String,
  petType: String,
  breed: String,
  gender: String,
  birthday: Date,
  weight: Number,
  photoUrl: { type: String, default: "" }, // <-- store Firebase image URL
}, { timestamps: true });

module.exports = mongoose.model("Pet", petSchema);

