const {
  getUserProfileService,
  updateUserProfileService,
  updateProfileImageService,
} = require("./user.service");
const { uploadToCloudinary, cloudinary } = require("../../config/cloudinary");
const getUserProfileController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserProfileService(id);
    res.status(200).json({
      success: "success",
      user,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateUserProfileController = async (req, res) => {
  try {
    const { username, email, password, bio } = req.body;
    let profile_image = null;
    if (req.file) {
      // get old image if exist and delete it
      const oldUser = await getUserProfileService(req.user.userId);
      if (oldUser.profile_image) {
        const publicId = oldUser.profile_image
          .split("/")
          .pop() // خد اسم الملف
          .split(".")[0]; // شيل الـ extension
        await cloudinary.uploader.destroy(`profile_images/${publicId}`);
      }

      // upload new image to cloundry
      const result = await uploadToCloudinary(req.file.buffer);
      profile_image = result.secure_url;
    }
    const updateUser = await updateUserProfileService(req.user.userId, {
      username,
      email,
      password,
      profile_image,
      bio,
    });
    res.status(200).json({
      message: "Profile updated successfully",
      user: updateUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllUsersController = async (req, res) => {
  try {
    const result = await getAllUsersService(req.user.userId);
    res.status(200).json({ success: true, users: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfileController,
  updateUserProfileController,
  getAllUsersController,
};
