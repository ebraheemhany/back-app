const { postLikesService, createLikeService } = require("./like.service");

const createLikesController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.postId;

    const result = await createLikeService(userId, postId);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get post likes
const getPostLikesController = async (req, res) => {
  try {
    const result = await postLikesService(req.params.postId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createLikesController,
  getPostLikesController,
};
