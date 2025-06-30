const router = require('express').Router();
const Poll = require('../models/poll');

router.post('/create', async (req, res) => {
  const { question, options } = req.body;
  const newPoll = new Poll({
    question,
    options,
    votes: Array(options.length).fill(0),
    createdBy: req.body.userId
  });
  await newPoll.save();
  res.status(201).send("Poll created");
});

router.get('/', async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
});

router.post('/vote/:id', async (req, res) => {
  const { optionIndex } = req.body;
  const poll = await Poll.findById(req.params.id);
  poll.votes[optionIndex]++;
  await poll.save();
  res.send("Vote casted");
});

module.exports = router;
