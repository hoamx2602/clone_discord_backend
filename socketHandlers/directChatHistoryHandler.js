const Conversation = require('../models/conversation');
const { updateChatHistory } = require('./updates/chat');

const directChatHistoryHandler = async (socket, data) => {
  try {
    const { userId } = socket.user;
    const { receiverUserId } = data;

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
      type: 'DIRECT',
    });

    if (conversation) {
      updateChatHistory(conversation._id.toString(), socket.id);
    }
  } catch (error) {
    console.log('DEBUG=================directChatHistoryHandler', error);
  }
};

module.exports = directChatHistoryHandler;
