const FriendInvitation = require('../../models/friendInvitation');
const {
  updateFriendsPendingInvitations,
} = require('../../socketHandlers/updates/friends');

const postReject = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId } = req.user;

    //remove that invitation from friend invitation collection
    const invitationExist = await FriendInvitation.findOne({ _id: id });
    if (invitationExist) {
      await FriendInvitation.findByIdAndDelete(id);
    }

    // update pending invitations
    updateFriendsPendingInvitations(userId);

    return res.status(200).send('Invitation successfully rejected!');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong, please try again!');
  }
};

module.exports = postReject;
