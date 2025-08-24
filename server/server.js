const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// Prefer native fetch if using Node.js 18+
// const fetch = require('node-fetch');
const User = require('./models/User');

const app = express();

app.use(cors({
  origin: 'https://silentvotes.vercel.app',
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/poll', require('./routes/poll'));

app.get('/', (req, res) => res.send('SilentVote API is running 🚀'));
app.get('/ping', (req, res) => res.send('Backend is active ✅'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    startKeepAlive();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log('🚦MongoDB disconnected, server shutting down.');
  process.exit(0);
});

function startKeepAlive() {
  // MongoDB Keep-Alive (using a lightweight ping)
  setInterval(async () => {
    try {
      await mongoose.connection.db.admin().ping();
      console.log('✅ MongoDB keep-alive ping successful');
    } catch (err) {
      console.error('❌ MongoDB keep-alive failed:', err.message);
    }
  }, 5 * 60 * 1000);

  // Backend Self-Ping (Native fetch if Node 18+, otherwise use node-fetch)
  setInterval(() => {
    fetch('https://silentvotes.onrender.com/ping')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        console.log('🔄 Backend self-ping successful');
      })
      .catch(err => console.error('❌ Backend self-ping failed:', err.message));
  }, 5 * 60 * 1000);
}
