const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0.5,
      max: 5,
    },
    text: {
      type: String,
      required: false,
      maxlength: 1000,
    }
  },
  { timestamps: true }
);

// Create a compound index to ensure a user can only review a property once
reviewSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review; 