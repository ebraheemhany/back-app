const {
  createCommentService,
  getAllCommentsService,
  editCommentService,
  deleteCommentService,
} = require("./comment.service");

const createCommentController = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.userId;
    const postId = req.params.postId;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }
    const comment = await createCommentService(userId, postId, content);

    res.status(201).json({
      message: "Comment added Successfuly",
      comment,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllCommentsController = async (req, res) => {
  try {
    const postId = req.params.postId;
    const result = await getAllCommentsService(postId);

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editCommentController = async (req, res) => {
  try {
    const { content } = req.body;
    const commentId = req.params.commentId;
    const userId = req.user.userId;
    console.log("userId →", req.user.userId);
    console.log("req.user →", req.user);
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }

    const result = await editCommentService(commentId, userId, content);
    res.status(200).json({
      message: "Comment updated Successfuly",
      result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCommentController = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.userId;

    const resulte = await deleteCommentService(userId, commentId);
    res.status(200).json(resulte);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCommentController,
  getAllCommentsController,
  editCommentController,
  deleteCommentController,
};
