const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("User already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });

    await user.save();
    res.status(201).send("User created");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).send("Invalid credentials");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Login failed");
  }
});

// Test Route
router.get('/test', (req, res) => {
  res.send('Auth route is working ✅');
});

module.exports = router;
