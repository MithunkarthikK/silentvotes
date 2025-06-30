const mongoose = require('mongoose');
const PollSchema = new mongoose.Schema({
  question: String,
  options: [String],
  votes: [Number],
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Poll', PollSchema);