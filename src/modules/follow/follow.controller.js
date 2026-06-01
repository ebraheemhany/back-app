const {
  createFollowService,
  getFollowersService,
  getFollowingService,
  getFollowStatsService,
  isFollowingService,
} = require("./follow.service");

const createFollowController = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const followingId = req.params.userId;
    const result = await createFollowService(followerId, followingId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getFollowersController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await getFollowersService(userId);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Following(اللي انا بتبعهم)
const getFollowingController = async (req, res) => {
  try {
    const result = await getFollowingService(req.params.userId);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Follow Stats
const getFollowStatsController = async (req, res) => {
  try {
    const result = await getFollowStatsService(req.params.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Check if Following
const isFollowingController = async (req, res) => {
  try {
    const result = await isFollowingService(
      req.user.userId,
      parseInt(req.params.userId),
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  createFollowController,
  getFollowersController,
  getFollowingController,
  getFollowStatsController,
  isFollowingController,
};
