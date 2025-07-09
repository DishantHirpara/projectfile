const router = require("express").Router()
const bcrypt = require("bcryptjs")
const multer = require("multer")

const Booking = require("../models/Booking")
const User = require("../models/User")
const Listing = require("../models/Listing")

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

/* GET TRIP LIST */
router.get("/:userId/trips", async (req, res) => {
  try {
    const { userId } = req.params
    const trips = await Booking.find({ customerId: userId }).populate("customerId hostId listingId")
    res.status(202).json(trips)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Can not find trips!", error: err.message })
  }
})

/* UPDATE USER PROFILE */
router.patch("/:userId/update", upload.single("profileImage"), async (req, res) => {
  try {
    const { userId } = req.params
    const { firstName, lastName, email, phone, password } = req.body
    
    // Create an object with the updated fields
    const updateFields = {}
    
    if (firstName) updateFields.firstName = firstName
    if (lastName) updateFields.lastName = lastName
    if (email) updateFields.email = email
    if (phone) updateFields.phone = phone
    
    // If a new password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt()
      updateFields.password = await bcrypt.hash(password, salt)
    }
    
    // If a new profile image is uploaded
    if (req.file) {
      updateFields.profileImagePath = req.file.path
    }
    
    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    )
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" })
    }
    
    // Don't send the password back to the client
    const userResponse = updatedUser.toObject()
    delete userResponse.password
    
    res.status(200).json({ message: "Profile updated successfully", user: userResponse })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error updating profile", error: err.message })
  }
})

/* ADD LISTING TO WISHLIST */
router.patch("/:userId/:listingId", async (req, res) => {
  try {
    const { userId, listingId } = req.params
    const user = await User.findById(userId)
    const listing = await Listing.findById(listingId).populate("creator")

    const favoriteListing = user.wishList.find((item) => item._id.toString() === listingId)

    if (favoriteListing) {
      user.wishList = user.wishList.filter((item) => item._id.toString() !== listingId)
      await user.save()
      res.status(200).json({ message: "Listing is removed from wish list", wishList: user.wishList})
    } else {
      user.wishList.push(listing)
      await user.save()
      res.status(200).json({ message: "Listing is added to wish list", wishList: user.wishList})
    }
  } catch (err) {
    console.log(err)
    res.status(404).json({ error: err.message })
  }
})

/* GET PROPERTY LIST */
router.get("/:userId/properties", async (req, res) => {
  try {
    const { userId } = req.params
    const properties = await Listing.find({ creator: userId }).populate("creator")
    res.status(202).json(properties)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Can not find properties!", error: err.message })
  }
})

/* GET RESERVATION LIST */
router.get("/:userId/reservations", async (req, res) => {
  try {
    const { userId } = req.params
    const reservations = await Booking.find({ hostId: userId }).populate("customerId hostId listingId")
    res.status(202).json(reservations)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Can not find reservations!", error: err.message })
  }
})


module.exports = router
