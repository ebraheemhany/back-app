const {
  createPostService,
  deletePostService,
  getAllPostsService,
  updatePostService,
  searchService,
  getPostsByUserIdService
} = require("./post.service");
const { uploadToCloudinary, cloudinary } = require("../../config/cloudinary");
const pool = require("../../config/db");
const createPostController = async (req, res) => {
  console.log(req.user);
  try {
    const userId = req.user.userId;
    const { content } = req.body;

    let media_url = null;
    let media_type = null;
    let public_id = null;
    if (req.file) {
      const isVideo = req.file.mimetype.startsWith("video");

      const result = await uploadToCloudinary(
        req.file.buffer,
        isVideo ? "video" : "image",
        "posts",
      );

      media_url = result.secure_url;
      media_type = result.resource_type;
      public_id = result.public_id;
    }

    // validation
    if (!content && !media_url) {
      return res.status(400).json({
        success: false,
        message: "Post cannot be empty",
      });
    }

    const post = await createPostService(userId, {
      content,
      media_url,
      media_type,
      public_id,
    });

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePostController = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;

    // check post
    const post = await deletePostService(postId, userId);

    // delete from cloudinary
    if (post.public_id) {
      await cloudinary.uploader.destroy(post.public_id, {
        resource_type: post.media_type === "video" ? "video" : "image",
      });
    }

    // delete from database
    await pool.query(`DELETE FROM posts WHERE id = $1`, [postId]);

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllPostsController = async (req, res) => {
  try {
    const posts = await getAllPostsService();
    res.json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePostController = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;
    const { content } = req.body;
    const post = await updatePostService(postId, userId);

    let media_url = post.media_url;
    let media_type = post.media_type;
    let public_id = post.public_id;

    if (req.file) {
      // check if add new post
      const isVedio = req.file.mimetype.startsWith("video");

      // delete old post media
      if (post.public_id) {
        await cloudinary.uploader.destroy(post.public_id, {
          resource_type: post.media_type === "video" ? "video" : "image",
        });
      }

      //  upload new post media

      const result = await uploadToCloudinary(
        req.file.buffer,
        isVedio ? "video" : "image",
        "posts",
      );

      media_url = result.secure_url;
      media_type = result.resource_type;
      public_id = result.public_id;
    }

    // 4- update DB
    const updatedPost = await pool.query(
      `
      UPDATE posts
      SET content = $1,
          media_url = $2,
          media_type = $3,
          public_id = $4,
          updated_at = NOW()
      WHERE id = $5
      RETURNING *
      `,
      [content, media_url, media_type, public_id, postId],
    );

    res.json({
      success: true,
      post: updatedPost.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchPostcontroller = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }
    const result = await searchService(q);

    res.json({
      success: true,
      count: result.posts.length + result.users.length,
      posts: result.posts,
      users: result.users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getPostsByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await getPostsByUserIdService(userId);
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createPostController,
  deletePostController,
  getAllPostsController,
  updatePostController,
  searchPostcontroller,
  getPostsByUserIdController,
};
