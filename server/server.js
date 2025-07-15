const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const fetch = require('node-fetch');
const User = require('./models/User');

const app = express();

// 🔐 CORS Configuration
app.use(cors({
  origin: 'https://silentvotes.vercel.app',
  credentials: true
}));

app.use(express.json());

// 🔗 API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/poll', require('./routes/poll'));

// 🌐 Root & Health Check
app.get('/', (req, res) => {
  res.send('SilentVote API is running 🚀');
});
app.get('/ping', (req, res) => {
  res.send('Backend is active ✅');
});

// 🔌 MongoDB Connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  startKeepAlive(); // ✅ Start keep-alive functions only after DB connects
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});


// 🔁 Keep-Alive Jobs (MongoDB + Self)
function startKeepAlive() {
  // ⏱️ MongoDB Keep-Alive
  setInterval(async () => {
    try {
      await User.findOne();
      console.log('✅ MongoDB keep-alive ping successful');
    } catch (err) {
      console.error('❌ MongoDB keep-alive failed:', err.message);
    }
  }, 5 * 60 * 1000); // every 5 minutes

  // 🌐 Backend Self-Ping (to keep Render awake)
  setInterval(() => {
    fetch('https://silentvotes.onrender.com/ping')
      .then(() => console.log('🔄 Backend self-ping successful'))
      .catch(err => console.error('❌ Backend self-ping failed:', err.message));
  }, 5 * 60 * 1000); // every 5 minutes
}
