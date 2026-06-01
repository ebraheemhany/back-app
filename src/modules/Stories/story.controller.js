const {
  createStoryService,
  getStoriesService,
  viewStoryService,
} = require("./story.service");

const createStoryContorller = async (req, res) => {
  try {
    const { caption, textContent, backgroundColor } = req.body;

    const story = await createStoryService(req.user.userId, req.file, {
      caption,
      textContent,
      backgroundColor,
    });
    res.status(201).json({ message: "Story created successfully", story });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Stories (بتاعت الناس اللي بتتبعهم)
const getStoriesController = async (req, res) => {
  try {
    const stories = await getStoriesService(req.user.userId);
    res.status(200).json({ success: true, stories });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const viewStoryController = async (req, res) => {
  try {
    const result = await viewStoryService(req.user.userId, req.params.storyId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getStoryViewsController = async (req, res) => {
  try {
    const result = await getStoryViewsService(
      req.user.userId,
      req.params.storyId,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteStoryController = async (req, res) => {
  try {
    const result = await deleteStoryService(
      req.user.userId,
      req.params.storyId,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  createStoryContorller,
  getStoriesController,
  viewStoryController,
  getStoryViewsController,
  deleteStoryController,
};
