const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
   rating: Number,
   comment: String,
   author: { type: mongoose.Schema.Types.ObjectId, ref: "User" } //I want to check who is  writing the review
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
