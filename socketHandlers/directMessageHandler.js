const Message = require('../models/message');
const Conversation = require('../models/conversation');
const { updateChatHistory } = require('./updates/chat');

const directMessageHandler = async (socket, data) => {
  try {
    const { userId } = socket.user;
    const { receiverUserId, content } = data;

    // Create a new message
    const message = await Message.create({
      content,
      authorId: userId,
      date: new Date(),
      type: 'DIRECT',
    });

    // Find if conversation exist with this two users - if not create new
    const conversation = await Conversation.findOne({
      participants: {
        $all: [userId, receiverUserId],
      },
    });

    if (conversation) {
      conversation.messages.push(message._id);
      await conversation.save();

      // perform and update to sender and receiver if it online
      updateChatHistory(conversation._id.toString());
    } else {
      // create new conversation if not exist
      const newConversation = await Conversation.create({
        messages: [message._id],
        participants: [userId, receiverUserId],
      });

      // perform and update to sender and receiver if it online
      updateChatHistory(conversation._id.toString());
    }
  } catch (error) {
    console.log('DEBUG=================directMessageHandler', error);
  }
};

module.exports = directMessageHandler;
