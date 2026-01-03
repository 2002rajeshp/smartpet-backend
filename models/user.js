// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true, lowercase: true },
//   password: { type: String, required: true },
// }, { timestamps: true });

// module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },             // empty for Google users
    provider: { type: String, default: 'local' }, // 'local' or 'google'
    googleId: { type: String },             // Google's user id (sub)
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
