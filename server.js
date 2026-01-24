// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const authRoutes = require('./routes/auth');

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', authRoutes);

// app.get('/', (req, res) => res.json({ success: true, message: 'API running' }));

// const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('MongoDB connected');
//     // app.listen(PORT, () => console.log(`Server running on ${PORT}`));
//     app.listen(PORT, '0.0.0.0', () => {
//   console.log("Server running on port " + PORT);
//   console.log("SERVER BOOTING...");
// console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);

// });

//   })
//   .catch(err => {
//     console.error('MongoDB connection error:', err);
//   });


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pet');
const safeZoneRoutes = require("./routes/safe");


const appRoutes = require('./routes/app');


const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pet', petRoutes);
app.use("/api/safe-zones", safeZoneRoutes);
app.use('/api/app', appRoutes);
app.use("/apk", express.static(path.join(__dirname, "apk")));


app.get('/', (req, res) => res.json({ success: true, message: 'API running' }));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log("Server running on port " + PORT);
      console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
    });
  })
  .catch(err => console.error('MongoDB error:', err));
