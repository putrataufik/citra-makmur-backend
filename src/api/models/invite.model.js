const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  used: {
    type: Boolean,
    default: false
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Invite', inviteSchema);
