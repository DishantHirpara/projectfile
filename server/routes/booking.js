const router = require("express").Router()
const jwt = require("jsonwebtoken")
const Booking = require("../models/Booking")

// Verify token middleware
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." })

    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    next()
  } catch (err) {
    res.status(401).json({ message: "Invalid token" })
  }
}

/* CREATE BOOKING */
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body

    // Verify user is creating a booking for themselves
    if (customerId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to create booking for another user" })
    }

    const newBooking = new Booking({ 
      customerId, 
      hostId, 
      listingId, 
      startDate, 
      endDate, 
      totalPrice,
      paymentStatus: "pending" 
    })
    
    await newBooking.save()
    res.status(200).json(newBooking)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Fail to create a new Booking!", error: err.message })
  }
})

/* GET BOOKINGS BY USER ID */
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params
    
    // Verify user is requesting their own bookings
    if (userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to view bookings for another user" })
    }
    
    const bookings = await Booking.find({
      $or: [{ customerId: userId }, { hostId: userId }]
    })
      .populate("listingId")
      .populate("customerId", "firstName lastName email profileImagePath")
      .populate("hostId", "firstName lastName email profileImagePath")
    
    res.status(200).json(bookings)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Failed to get bookings", error: err.message })
  }
})

/* GET BOOKING BY ID */
router.get("/:bookingId", verifyToken, async (req, res) => {
  try {
    const { bookingId } = req.params
    
    const booking = await Booking.findById(bookingId)
      .populate("listingId")
      .populate("customerId", "firstName lastName email profileImagePath")
      .populate("hostId", "firstName lastName email profileImagePath")
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }
    
    // Verify user is authorized to view this booking
    if (
      booking.customerId._id.toString() !== req.user.id && 
      booking.hostId._id.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized to view this booking" })
    }
    
    res.status(200).json(booking)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Failed to get booking", error: err.message })
  }
})

/* UPDATE BOOKING PAYMENT STATUS */
router.patch("/:bookingId/payment-status", verifyToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentStatus, paymentIntentId, paymentMethod } = req.body

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only allow admin or the customer to update payment status
    if (req.user.id !== booking.customerId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to update this booking" });
    }

    // Update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus,
        paymentIntentId,
        paymentMethod
      },
      { new: true }
    );

    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: "Failed to update booking payment status", error: err.message })
  }
});

/* CANCEL BOOKING */
router.delete("/:bookingId", verifyToken, async (req, res) => {
  try {
    const { bookingId } = req.params
    
    const booking = await Booking.findById(bookingId)
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }
    
    // Only allow admin, customer, or host to cancel booking
    if (
      booking.customerId.toString() !== req.user.id && 
      booking.hostId.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" })
    }
    
    // If booking is paid, update status to refunded instead of deleting
    if (booking.paymentStatus === "paid") {
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { 
          paymentStatus: "refunded",
          updatedAt: new Date()
        },
        { new: true }
      )
      
      return res.status(200).json({ message: "Booking refunded", booking: updatedBooking })
    }
    
    // If not paid, delete the booking
    await Booking.findByIdAndDelete(bookingId)
    
    res.status(200).json({ message: "Booking cancelled successfully" })
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Failed to cancel booking", error: err.message })
  }
})

module.exports = router