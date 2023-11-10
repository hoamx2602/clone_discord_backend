const { getActiveRoom } = require('../serverStore');
const { updateRooms } = require('./updates/rooms');

const roomLeaveHandler = (socket, data) => {
  const { roomId } = data;

  const activeRooms = getActiveRoom(roomId);

  if (activeRooms) {
    leaveActiveRoom(roomId, socket.id);

    updateRooms();
  }
};
