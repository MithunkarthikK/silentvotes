const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const fetch = require('node-fetch'); // 👈 Make sure to install this
const User = require('./models/User'); // 👈 Replace with any valid model

const app = express();

app.use(cors({
  origin: 'https://silentvotes.vercel.app', 
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/poll', require('./routes/poll'));

app.get('/', (req, res) => {
  res.send('SilentVote API is running 🚀');
});

// 👇 Self-ping route
app.get('/ping', (req, res) => {
  res.send('Backend is active ✅');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    // ✅ MongoDB Keep-Alive Ping
    setInterval(async () => {
      try {
        await User.findOne(); // any small query
        console.log("✅ MongoDB Keep-Alive Ping Successful");
      } catch (err) {
        console.error("❌ MongoDB Keep-Alive Ping Failed:", err.message);
      }
    }, 5 * 60 * 1000); // every 5 minutes

    // ✅ Self-Ping to Keep Backend Awake
    setInterval(() => {
      fetch("https://silentvotes.onrender.com/ping") // 👈 Replace with your deployed backend URL
        .then(() => console.log("🔄 Self-ping successful"))
        .catch(err => console.error("❌ Self-ping failed:", err.message));
    }, 5 * 60 * 1000);

  })
  .catch(err => console.log(err));
