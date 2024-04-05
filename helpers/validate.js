/**
 * A JOI validation schema for `req.body` in '/api-docs'
 * Contains schema for admin, user, inventory, and order records.
 */

const Joi = require("joi");

const adminPOSTSchema = Joi.object().keys({
  displayName: Joi.string()
    .trim()
    .lowercase()
    .required()
    .min(2)
    .regex(/^[a-zA-Z.'_-\s]+$/)
    .messages({
      "string.min": "\"displayName\" must be at least 2 characters long.",
      "string.pattern.base":
        "\"displayName\" must contain only English letters, numbers, periods, underscores, apostrophes, single-spaces, and hyphens."
    }),
  fname: Joi.string()
    .trim()
    .lowercase()
    .required()
    .min(2)
    .regex(/^[a-zA-Z.'_-\s]+$/)
    .messages({
      "string.min": "\"displayName\" must be at least 2 characters long.",
      "string.pattern.base":
        "\"fname\" must contain only English letters, numbers, periods, underscores, apostrophes, single-spaces, and hyphens."
    }),
  lname: Joi.string()
    .empty("")
    .trim()
    .lowercase()
    .min(2)
    .regex(/^[a-zA-Z.'_-\s]+$/)
    .messages({
      "string.min": "\"displayName\" must be at least 2 characters long.",
      "string.pattern.base":
        "\"lname\" must contain only English letters, numbers, periods, underscores, apostrophes, single-spaces, and hyphens."
    }),
  email: Joi.string().trim().lowercase().required().email().min(7),
  op_lvl: Joi.number().integer().required().min(1).max(2),
  profilePic: Joi.string().empty("").trim().uri()
});

const adminPUTSchema = Joi.object().keys({
  displayName: Joi.string()
    .empty("")
    .trim()
    .lowercase()
    .min(2)
    .regex(/^[a-zA-Z.'_-]+$/)
    .messages({
      "string.min": "\"displayName\" must be at least 2 characters long.",
      "string.pattern.base":
        "\"displayName\" must contain only English letters, numbers, periods, underscores, apostrophes, single-spaces, and hyphens."
    }),
  email: Joi.string().empty("").trim().lowercase().email().min(7),
  op_lvl: Joi.number().empty("").integer().min(1).max(2),
  fname: Joi.string()
    .empty("")
    .trim()
    .lowercase()
    .min(2)
    .regex(/^[a-zA-Z.'_-\s]+$/)
    .messages({
      "string.min": "\"displayName\" must be at least 2 characters long.",
      "string.pattern.base":
        "\"fname\" must contain only English letters, numbers, periods, underscores, apostrophes, single-spaces, and hyphens."
    }),
  lname: Joi.string()
    .empty("")
    .trim()
    .lowercase()
    .min(2)
    .regex(/^[a-zA-Z.'_-\s]+$/)
    .messages({
      "string.min": "\"displayName\" must be at least 2 characters long.",
      "string.pattern.base":
        "\"lname\" must contain only English letters, numbers, periods, underscores, apostrophes, single-spaces, and hyphens."
    }),
  profilePicURI: Joi.string().empty("").trim().uri() // may not need to check for this as some Google accounts have a default pic.
});

const customerPOSTSchema = Joi.object().keys({
  displayName: Joi.string()
    .trim()
    .lowercase()
    .required()
    .min(2)
    .regex(/^[a-zA-Z.'_-\s]+$/)
    .messages({
      "string.min": "\"displayName\" must be at least 2 characters long.",
      "string.pattern.base":
        "\"displayName\" must contain only English letters, numbers, periods, underscores, apostrophes, single-spaces, and hyphens."
    }),
  fname: Joi.string()
    .trim()
    .lowercase()
    .required()
    .min(2)
    .regex(/^[a-zA-Z.'_-\s]+$/)
    .messages({
      "string.min": "\"displayName\" must be at least 2 characters long.",
      "string.pattern.base":
        "\"fname\" must contain only English letters, numbers, periods, underscores, apostrophes, single-spaces, and hyphens."
    }),
  lname: Joi.string()
    .empty("")
    .trim()
    .lowercase()
    .min(2)
    .regex(/^[a-zA-Z.'_-\s]+$/)
    .messages({
      "string.min": "\"displayName\" must be at least 2 characters long.",
      "string.pattern.base":
        "\"lname\" must contain only English letters, numbers, periods, underscores, apostrophes, single-spaces, and hyphens."
    }),

  email: Joi.string().trim().lowercase().required().email().min(7),
  profilePicURI: Joi.string().empty("").trim().uri()
});

const customerPUTSchema = Joi.object().keys({
  displayName: Joi.string()
    .empty("")
    .trim()
    .min(2)
    .regex(/^[a-zA-Z.'_-\s]+$/)
    .messages({
      "string.min": "\"displayName\" must be at least 2 characters long.",
      "string.pattern.base":
        "\"displayName\" must contain only English letters, numbers, periods, underscores, apostrophes, single-spaces, and hyphens."
    }),
  fname: Joi.string()
    .empty("")
    .trim()
    .lowercase()
    .min(2)
    .regex(/^[a-zA-Z.'_-\s]+$/)
    .messages({
      "string.min": "\"displayName\" must be at least 2 characters long.",
      "string.pattern.base":
        "\"fname\" must contain only English letters, numbers, periods, underscores, apostrophes, single-spaces, and hyphens."
    }),
  lname: Joi.string()
    .empty("")
    .trim()
    .lowercase()
    .min(2)
    .regex(/^[a-zA-Z.'_-\s]+$/)
    .messages({
      "string.min": "\"displayName\" must be at least 2 characters long.",
      "string.pattern.base":
        "\"lname\" must contain only English letters, numbers, periods, underscores, apostrophes, single-spaces, and hyphens."
    }),

  email: Joi.string().empty("").trim().lowercase().email().min(7),
  profilePicURI: Joi.string().empty("").trim().uri()
});

const inventoryPOSTSchema = Joi.object().keys({
  productName: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  price: Joi.number().integer().required().min(1),
  stock: Joi.number().integer().required().min(1)
});

const inventoryPUTSchema = Joi.object().keys({
  productName: Joi.string().empty("").trim(),
  description: Joi.string().empty("").trim(),
  price: Joi.number().integer().empty("").min(1),
  stock: Joi.number().integer().empty("").min(1)
});

const orderPOSTSchema = Joi.object().keys({
  itemName: Joi.string().trim().lowercase().required().min(1),
  amount: Joi.number().integer().required().min(1)
});

const orderPUTSchema = Joi.object().keys({
  itemName: Joi.string().empty("").trim().lowercase().required().min(1),
  amount: Joi.number().integer().required().min(1),
  sold: Joi.boolean().empty("")
});

module.exports = {
  adminPOSTSchema,
  adminPUTSchema,
  customerPOSTSchema,
  customerPUTSchema,
  inventoryPOSTSchema,
  inventoryPUTSchema,
  orderPOSTSchema,
  orderPUTSchema
};
