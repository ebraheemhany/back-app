const Joi = require("joi");

// register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username must be less than 30 characters",
      "any.required": "Username is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).max(30).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};

// login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};

// post validation
const postValidation = (data) => {
  const schema = Joi.object({
    content: Joi.string().min(1).max(500).required().messages({
      "string.min": "Content cannot be empty",
      "string.max": "Content must be less than 500 characters",
      "any.required": "Content is required",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};

// Comment validation
const commentValidation = (data) => {
  const schema = Joi.object({
    content: Joi.string().min(1).max(200).required().messages({
      "string.min": "Comment cannot be empty",
      "string.max": "Comment must be less than 200 characters",
      "any.required": "Content is required",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};

// Update Profile validation
const updateProfileValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).messages({
      "string.min": "Username must be at least 3 characters",
    }),
    email: Joi.string().email().messages({
      "string.email": "Please enter a valid email",
    }),
    password: Joi.string().min(6).max(30).messages({
      "string.min": "Password must be at least 6 characters",
    }),
    bio: Joi.string().max(200).messages({
      "string.max": "Bio must be less than 200 characters",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  registerValidation,
  loginValidation,
  postValidation,
  commentValidation,
  updateProfileValidation,
};
