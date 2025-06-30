const mongoose = require('mongoose');
const PollSchema = new mongoose.Schema({
  question: String,
  options: [String],
  votes: [Number],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Poll', PollSchema);
