const express = require("express");
const Review = require("../models/Review.js");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const router = express.Router();

/* MIDDLEWARE */
const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* CREATE REVIEW */
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { propertyId, userId, rating, text } = req.body;

    // Verify user ID from token matches the submitted user ID
    if (req.user.id !== userId) {
      return res.status(403).json({ error: "Unauthorized - User ID mismatch" });
    }

    // Check if the user has already reviewed this property
    const existingReview = await Review.findOne({ userId, propertyId });
    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this property" });
    }

    const newReview = new Review({
      userId,
      propertyId,
      rating,
      text: text || "",
    });

    await newReview.save();
    
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET PROPERTY REVIEWS */
router.get("/property/:propertyId", async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    // Validate propertyId format
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ error: "Invalid property ID format" });
    }

    const reviews = await Review.find({ propertyId })
      .populate("userId", "firstName lastName profileImagePath")
      .sort({ createdAt: -1 });
    
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET USER REVIEWS */
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user ID from token matches the requested user ID
    if (req.user.id !== userId) {
      return res.status(403).json({ error: "Unauthorized - User ID mismatch" });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const reviews = await Review.find({ userId })
      .populate("propertyId", "title city country listingPhotoPaths")
      .sort({ createdAt: -1 });
    
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE REVIEW */
router.patch("/:reviewId", verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, text } = req.body;

    // Validate reviewId format
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID format" });
    }

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Verify the user is the review owner
    if (req.user.id !== review.userId.toString()) {
      return res.status(403).json({ error: "Unauthorized - Not your review" });
    }

    // Update the review
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, text },
      { new: true }
    );

    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE REVIEW */
router.delete("/:reviewId", verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    // Validate reviewId format
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID format" });
    }

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Verify the user is the review owner
    if (req.user.id !== review.userId.toString()) {
      return res.status(403).json({ error: "Unauthorized - Not your review" });
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 