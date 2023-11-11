const { addNewConnectedUser } = require('../serverStore');
const {
  updateFriendsPendingInvitations,
  updateFriends,
} = require('./updates/friends');
const { updateRooms } = require('./updates/rooms');

const newConnectionHandler = async (socket, io) => {
  const userDetails = socket.user;

  addNewConnectedUser({
    socketId: socket.id,
    userId: userDetails.userId,
  });

  // update pending friends invitations list
  updateFriendsPendingInvitations(userDetails.userId);

  // update friends list
  updateFriends(userDetails.userId);

  setTimeout(() => {
    updateRooms(socket.id);
  }, 500);
};

module.exports = newConnectionHandler;
