const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'https://silentvotes.vercel.app/', 
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/poll', require('./routes/poll'));

app.get('/', (req, res) => {
  res.send('SilentVote API is running 🚀');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));
