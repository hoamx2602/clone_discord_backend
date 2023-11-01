const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const friendInvitationSchema = new mongoose.Schema({
  mail: { type: String, unique: true },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('FriendInvitation', friendInvitationSchema);
