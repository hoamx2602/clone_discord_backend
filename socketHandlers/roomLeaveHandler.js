const { getActiveRoom, leaveActiveRoom } = require('../serverStore');
const { updateRooms } = require('./updates/rooms');

const roomLeaveHandler = (socket, data) => {
  const { roomId } = data;

  const activeRoom = getActiveRoom(roomId);

  if (activeRoom) {
    leaveActiveRoom(roomId, socket.id);

    updateRooms();
  }
};

module.exports = roomLeaveHandler;
