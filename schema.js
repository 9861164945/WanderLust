const Joi = require('joi');

// Schema for Listing Validation
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string()
            .required()
            .messages({
                "string.base": "Title must be a string.",
                "any.required": "Title is required.",
            }),
        description: Joi.string()
            .required()
            .messages({
                "string.base": "Description must be a string.",
                "any.required": "Description is required.",
            }),
        location: Joi.string()
            .required()
            .messages({
                "string.base": "Location must be a string.",
                "any.required": "Location is required.",
            }),
        country: Joi.string()
            .required()
            .messages({
                "string.base": "Country must be a string.",
                "any.required": "Country is required.",
            }),
        price: Joi.number()
            .required()
            .min(0)
            .messages({
                "number.base": "Price must be a number.",
                "number.min": "Price cannot be less than 0.",
                "any.required": "Price is required.",
            }),
        image: Joi.string()
            .allow("", null)
            .messages({
                "string.base": "Image URL must be a string.",
            }),
    }).required()
});

// Schema for Review Validation
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .required()
            .min(1)
            .max(5)
            .messages({
                "number.base": "Rating must be a number.",
                "number.min": "Rating must be at least 1.",
                "number.max": "Rating cannot exceed 5.",
                "any.required": "Rating is required.",
            }),
        comment: Joi.string()
            .required()
            .messages({
                "string.base": "Comment must be a string.",
                "any.required": "Comment is required.",
            }),
    }).required()
});
