const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/auth.js")
const listingRoutes = require("./routes/listing.js")
const bookingRoutes = require("./routes/booking.js")
const userRoutes = require("./routes/user.js")
const adminRoutes = require("./routes/admin.js")
const paymentRoutes = require("./routes/payment.js")
const contactRoutes = require("./routes/contact.js")
const reviewRoutes = require("./routes/review.js")

app.use(cors());

// This is needed for Stripe webhook
app.use("/payments/webhook", express.raw({ type: "application/json" }));

// For regular routes, use regular JSON parsing
app.use(express.json());
app.use(express.static("public"));

/* ROUTES */
app.use("/auth", authRoutes)
app.use("/properties", listingRoutes)
app.use("/bookings", bookingRoutes)
app.use("/users", userRoutes)
app.use("/admin", adminRoutes)
app.use("/payments", paymentRoutes)
app.use("/contact", contactRoutes)
app.use("/reviews", reviewRoutes)

/* MONGOOSE SETUP */
const PORT = 3001;
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "Dream_Nest",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((err) => console.log(`${err} did not connect`));
