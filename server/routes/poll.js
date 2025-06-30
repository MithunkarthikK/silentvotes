const router = require('express').Router();
const Poll = require('../models/Poll');
const jwt = require('jsonwebtoken');

router.post('/create', async (req, res) => {
  const { question, options, userId } = req.body;
  const newPoll = new Poll({
    question,
    options,
    votes: Array(options.length).fill(0),
    voters: [],
    createdBy: userId
  });
  await newPoll.save();
  res.status(201).send("Poll created");
});

router.get('/', async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
});

router.post('/vote/:id', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("No token");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  const poll = await Poll.findById(req.params.id);
  if (!poll.voters) poll.voters = [];

  if (poll.voters.includes(userId)) {
    return res.status(403).send("You already voted");
  }

  poll.votes[req.body.optionIndex]++;
  poll.voters.push(userId);
  await poll.save();

  res.send("Vote recorded");
});

module.exports = router;