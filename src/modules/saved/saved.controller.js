const {
  toggleSavePostService,
  getSavedPostsService,
} = require("./saved.service");

const toggleSavePostController = async (req, res) => {
  try {
    const result = await toggleSavePostService(
      req.user.userId,
      parseInt(req.params.postId),
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSavedPostsController = async (req, res) => {
  try {
    const posts = await getSavedPostsService(req.user.userId);
    res.status(200).json({ posts });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { toggleSavePostController, getSavedPostsController };
