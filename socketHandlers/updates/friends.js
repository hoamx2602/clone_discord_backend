const User = require('../../models/user');
const FriendInvitation = require('../../models/friendInvitation');
const serverStore = require('../../serverStore');

const updateFriendsPendingInvitations = async (userId) => {
  try {
    const pendingInvitations = await FriendInvitation.find({
      receiverId: userId,
    }).populate('senderId', '_id username mail');

    // find all active connections of specific userId
    const receiverList = serverStore.getActiveConnections(userId);

    const io = serverStore.getSocketServerInstance();
    receiverList.forEach((receiverSocketId) => {
      io.to(receiverSocketId).emit('friends-invitations', {
        pendingInvitations: pendingInvitations ? pendingInvitations : [],
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const updateFriends = async (userId) => {
  try {
    // find active connection of specific id (only online user)
    const receiverList = serverStore.getActiveConnections(userId);

    if (receiverList.length) {
      const user = await User.findById(userId, {
        _id: 1,
        friends: 1,
      }).populate('friends', '_id username mail ');

      if (user) {
        const friendsList = user.friends.map((friend) => {
          return {
            id: friend._id,
            mail: friend.mail,
            username: friend.username,
          };
        });

        // get io instance, to emit event to all friends
        const io = serverStore.getSocketServerInstance();
        receiverList.forEach((receiverSocketId) => {
          io.to(receiverSocketId).emit('friends-list', {
            friends: friendsList ? friendsList : [],
          });
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  updateFriendsPendingInvitations,
  updateFriends,
};
