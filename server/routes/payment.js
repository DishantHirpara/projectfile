const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Listing = require("../models/Listing");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Verify token middleware
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Create a payment intent
router.post("/create-payment-intent", verifyToken, async (req, res) => {
  try {
    const { amount, bookingId, currency = "inr" } = req.body;

    // Calculate GST amount (18%)
    const baseAmount = amount / 1.18;
    const gstAmount = amount - baseAmount;

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe requires amount in cents
      currency,
      metadata: {
        bookingId,
        userId: req.user.id,
        baseAmount: baseAmount.toFixed(2),
        gstAmount: gstAmount.toFixed(2)
      }
    });

    // Return the client secret
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      baseAmount: baseAmount.toFixed(2),
      gstAmount: gstAmount.toFixed(2)
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: error.message });
  }
});

// Confirm booking after successful payment
router.post("/confirm-booking", verifyToken, async (req, res) => {
  try {
    const { bookingId, paymentIntentId } = req.body;
    
    // Verify the payment was successful
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment was not successful" });
    }
    
    // Update the booking with payment information
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        paymentStatus: "paid",
        paymentIntentId,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // Return the updated booking
    res.status(200).json({ booking });
  } catch (error) {
    console.error("Error confirming booking:", error);
    res.status(500).json({ message: error.message });
  }
});

// Webhook for Stripe events
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || "whsec_test"
    );
  } catch (err) {
    console.log(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      // Update booking status in database
      if (paymentIntent.metadata.bookingId) {
        await Booking.findByIdAndUpdate(
          paymentIntent.metadata.bookingId,
          { 
            paymentStatus: "paid",
            paymentIntentId: paymentIntent.id,
            updatedAt: new Date()
          }
        );
      }
      break;
    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      // Update booking status to failed
      if (failedPayment.metadata.bookingId) {
        await Booking.findByIdAndUpdate(
          failedPayment.metadata.bookingId,
          { 
            paymentStatus: "failed",
            paymentIntentId: failedPayment.id,
            updatedAt: new Date()
          }
        );
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

// Get payment status for a booking
router.get("/status/:bookingId", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // Check if the user is authorized to view this booking
    if (
      booking.customerId.toString() !== req.user.id && 
      booking.hostId.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized to view this booking" });
    }
    
    res.status(200).json({
      paymentStatus: booking.paymentStatus || "pending",
      paymentIntentId: booking.paymentIntentId
    });
  } catch (error) {
    console.error("Error getting payment status:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 