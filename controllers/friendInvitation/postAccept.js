const User = require('../../models/user');
const FriendInvitation = require('../../models/friendInvitation');
const {
  updateFriendsPendingInvitations,
  updateFriends,
} = require('../../socketHandlers/updates/friends');

const postAccept = async (req, res) => {
  try {
    const { id } = req.body;
    const invitation = await FriendInvitation.findById(id);
    if (!invitation) {
      return res.status(401).send('Error occurred. Please try again!');
    }

    const { senderId, receiverId } = invitation;
    // add friend to both users
    const sender = await User.findById(senderId);
    sender.friends = [...sender.friends, receiverId];

    const receiver = await User.findById(receiverId);
    receiver.friends = [...receiver.friends, senderId];

    await sender.save();
    await receiver.save();

    // delete invitation
    await FriendInvitation.findByIdAndDelete(id);

    // update list of the friends if the users are online
    updateFriends(senderId.toString());
    updateFriends(receiverId.toString());

    // update list of friends pending invitations
    updateFriendsPendingInvitations(receiverId.toString());

    return res.status(200).send('Friend successfully added!');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong, please try again!');
  }
};

module.exports = postAccept;
