const pool = require("../../config/db");
const { uploadToCloudinary } = require("../../config/cloudinary");

const createStoryService = async (
  userId,
  file,
  { caption, textContent, backgroundColor },
) => {
  if (!file && !textContent) {
    throw new Error("Media or text is required");
  }

  let mediaUrl = null;
  let mediaType = "text";
  if (file) {
    // image or video
    const resourceType = file.mimetype.startsWith("video") ? "video" : "image";
    const result = await uploadToCloudinary(
      file.buffer,
      resourceType,
      "stories",
    );
    mediaUrl = result.secure_url;
    mediaType = resourceType;
  }

  const story = await pool.query(
    `INSERT INTO stories (user_id, media_url, media_type, caption, text_content, background_color)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      userId,
      mediaUrl,
      mediaType,
      caption,
      textContent,
      backgroundColor || "#000000",
    ],
  );

  return story.rows[0];
};

// Get Stories (بتاعت الناس اللي بتتبعهم)
const getStoriesService = async (userId) => {
  const stories = await pool.query(
    `SELECT 
      users.id AS user_id,
      users.username,
      users.profile_image,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', stories.id,
          'media_url', stories.media_url,
          'media_type', stories.media_type,
          'caption', stories.caption,
          'created_at', stories.created_at,
          'expires_at', stories.expires_at,
          -- ✅ هل اليوزر شافها
          'is_viewed', CASE 
            WHEN story_views.user_id IS NOT NULL THEN TRUE 
            ELSE FALSE 
          END
        ) ORDER BY stories.created_at ASC
      ) AS stories
     FROM stories
     JOIN users ON stories.user_id = users.id
     LEFT JOIN story_views ON stories.id = story_views.story_id 
       AND story_views.user_id = $1
     WHERE stories.expires_at > NOW()  -- ✅ مش منتهية
     AND (
       stories.user_id = $1  -- ✅ بتاعتك
       OR stories.user_id IN (
         SELECT following_id FROM follows WHERE follower_id = $1 -- ✅ بتاعت الناس اللي بتتبعهم
       )
     )
     GROUP BY users.id
     ORDER BY MAX(stories.created_at) DESC`,
    [userId],
  );

  return stories.rows;
};

// View Story
const viewStoryService = async (userId, storyId) => {
  // check if story exist
  const story = await pool.query(
    `SELECT * FROM stories WHERE id = $1 AND expires_at > NOW()`,
    [storyId],
  );

  if (story.rows.length === 0) {
    throw new Error("Story not found or expired");
  }

  // ✅ سجّل المشاهدة
  await pool.query(
    `INSERT INTO story_views (story_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (story_id, user_id) DO NOTHING`,
    [storyId, userId],
  );

  return { message: "Story viewed" };
};

// Get Story Views (مين شاف الـ Story)
const getStoryViewsService = async (userId, storyId) => {
  // تأكد إنك صاحب الـ Story
  const story = await pool.query(
    `SELECT * FROM stories WHERE id = $1 AND user_id = $2`,
    [storyId, userId],
  );

  if (story.rows.length === 0) {
    throw new Error("Story not found");
  }

  const views = await pool.query(
    `SELECT 
      users.id,
      users.username,
      users.profile_image,
      story_views.viewed_at
     FROM story_views
     JOIN users ON story_views.user_id = users.id
     WHERE story_views.story_id = $1
     ORDER BY story_views.viewed_at DESC`,
    [storyId],
  );

  return {
    count: views.rows.length,
    views: views.rows,
  };
};

// Delete Story
const deleteStoryService = async (userId, storyId) => {
  const story = await pool.query(
    `SELECT * FROM stories WHERE id = $1 AND user_id = $2`,
    [storyId, userId],
  );

  if (story.rows.length === 0) {
    throw new Error("Story not found");
  }

  await pool.query(`DELETE FROM stories WHERE id = $1`, [storyId]);
  return { message: "Story deleted successfully" };
};

// =====================
// Delete Expired Stories (شغّلها كل ساعة)
// =====================
const deleteExpiredStoriesService = async () => {
  await pool.query(`DELETE FROM stories WHERE expires_at < NOW()`);
  console.log("✅ Expired stories deleted");
};

module.exports = {
  createStoryService,
  getStoriesService,
  viewStoryService,
  getStoryViewsService,
  deleteStoryService,
  deleteExpiredStoriesService,
};
