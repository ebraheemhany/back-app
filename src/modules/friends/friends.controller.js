// friend.controller.js
const { getFriendsService } = require("./friends.service");

const getFriendsController = async (req, res) => {
  try {
    const friends = await getFriendsService(req.user.userId);
    res.status(200).json({ friends });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getFriendsController };
