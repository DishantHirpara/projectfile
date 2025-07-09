const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Listing = require("../models/Listing");
const Booking = require("../models/Booking");

// Middleware to verify admin access
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    
    // Fetch user to check if admin
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get dashboard stats
router.get("/dashboard-stats", verifyAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const listingCount = await Listing.countDocuments();
    const bookingCount = await Booking.countDocuments();
    
    // Calculate total revenue from paid bookings
    const paidBookings = await Booking.find({ paymentStatus: "paid" });
    const totalRevenue = paidBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    
    // Recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("hostId", "firstName lastName email")
      .populate("customerId", "firstName lastName email");
    
    res.status(200).json({
      userCount,
      listingCount,
      bookingCount,
      totalRevenue,
      recentBookings
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all listings 
router.get("/listings", verifyAdmin, async (req, res) => {
  try {
    const listings = await Listing.find().populate("creator", "firstName lastName email");
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all bookings
router.get("/bookings", verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("hostId", "firstName lastName email")
      .populate("customerId", "firstName lastName email")
      .populate("listingId", "title location price");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a booking
router.delete("/bookings/:id", verifyAdmin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    await Booking.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a user
router.delete("/users/:id", verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a listing
router.delete("/listings/:id", verifyAdmin, async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a listing
router.put("/listings/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate("creator", "firstName lastName email");
    
    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    
    res.status(200).json(updatedListing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a user
router.put("/users/:id", verifyAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, isAdmin } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        isAdmin
      },
      { new: true }
    ).select("-password");
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;