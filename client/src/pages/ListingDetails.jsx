import { useEffect, useState } from "react";
import "../styles/ListingDetails.scss";
import { useNavigate, useParams } from "react-router-dom";
import { facilities } from "../data";
import Dialog from '@mui/material/Dialog';

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import StripeWrapper from "../components/StripeWrapper";
import PropertyReview from "../components/PropertyReview";
import { Button, Rating, Box, Typography, Divider } from "@mui/material";
import { Star as StarIcon, RateReview as RateReviewIcon } from "@mui/icons-material";

const ListingDetails = () => {
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);

  const getListingDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/properties/${listingId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setListing(data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing Details Failed", err.message);
    }
  };

  const getPropertyReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/reviews/property/${listingId}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
        
        // Calculate average rating
        if (data.length > 0) {
          const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating(totalRating / data.length);
        }
      }
    } catch (err) {
      console.log("Fetch Property Reviews Failed", err.message);
    }
  };

  useEffect(() => {
    getListingDetails();
    getPropertyReviews();
  }, []);

  console.log(listing)


  /* BOOKING CALENDAR */
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    // Update the selected date range when user makes a selection
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24))); // Ensure at least 1 night

  /* SUBMIT BOOKING */
  const customerId = useSelector((state) => state?.user?._id)

  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!customerId || !token) {
      navigate('/login');
      return;
    }

    try {
      const bookingForm = {
        customerId,
        listingId,
        hostId: listing.creator._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing.price * dayCount,
      }

      const response = await fetch("http://localhost:3001/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bookingForm)
      })

      if (response.ok) {
        const bookingData = await response.json();
        setCurrentBooking(bookingData);
        setShowPaymentModal(true);
      }
    } catch (err) {
      console.log("Submit Booking Failed.", err.message)
    }
  }

  const handlePaymentSuccess = () => {
    // Close the payment modal and redirect to trips page
    setShowPaymentModal(false);
    navigate(`/${customerId}/trips`);
  };

  const handlePaymentCancel = () => {
    // Close the payment modal without proceeding
    setShowPaymentModal(false);
  };
  
  const handleOpenReviewModal = () => {
    if (!customerId || !token) {
      navigate('/login');
      return;
    }
    setShowReviewModal(true);
  };
  
  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  };
  
  const handleSubmitReview = async (reviewData) => {
    try {
      const reviewForm = {
        propertyId: listingId,
        userId: customerId,
        rating: reviewData.rating,
        text: reviewData.review,
      };
      
      const response = await fetch("http://localhost:3001/reviews/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      });
      
      if (response.ok) {
        // Refresh reviews after posting a new one
        getPropertyReviews();
      }
    } catch (err) {
      console.log("Submit Review Failed.", err.message);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      
      <div className="listing-details">
        <div className="title">
          <h1>{listing.title}</h1>
          <div className="rating-summary">
            <Box display="flex" alignItems="center">
              <StarIcon sx={{ color: '#FFB400', marginRight: '5px' }} />
              <Typography variant="h6">
                {averageRating > 0 ? averageRating.toFixed(1) : 'New'} 
                {reviews.length > 0 && ` (${reviews.length} reviews)`}
              </Typography>
            </Box>
          </div>
        </div>

        <div className="photos">
          {listing.listingPhotoPaths?.map((item, index) => (
            <img
              key={index}
              src={`http://localhost:3001/${item.replace("public", "")}`}
              alt="listing photo"
            />
          ))}
        </div>

        <h2>
          {listing.type} in {listing.city}, {listing.province},{" "}
          {listing.country}
        </h2>
        <p>
          {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
          {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />

        <div className="profile">
          {listing.creator && listing.creator.profileImagePath ? (
            <img
              src={`http://localhost:3001/${listing.creator.profileImagePath.replace(
                "public",
                ""
              )}`}
              alt="Host"
            />
          ) : (
            <div className="profile-placeholder">
              {listing.creator && listing.creator.firstName ? listing.creator.firstName[0] : 'H'}
            </div>
          )}
          <h3>
            Hosted by {listing.creator ? `${listing.creator.firstName || ''} ${listing.creator.lastName || ''}` : 'Host'}
          </h3>
        </div>
        <hr />

        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />

        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />
        
        {/* Reviews Section */}
        <div className="reviews-section">
          <div className="reviews-header">
            <h2>
              <StarIcon sx={{ verticalAlign: 'middle', marginRight: '8px' }} />
              {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings yet'} 
              {reviews.length > 0 && ` · ${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}`}
            </h2>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<RateReviewIcon />}
              onClick={handleOpenReviewModal}
              className="write-review-button"
            >
              Write a Review
            </Button>
          </div>
          
          {reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      {review.userId.profileImagePath ? (
                        <img 
                          src={`http://localhost:3001/${review.userId.profileImagePath.replace("public", "")}`} 
                          alt={review.userId.firstName} 
                          className="reviewer-image"
                        />
                      ) : (
                        <div className="reviewer-placeholder">
                          {review.userId.firstName[0]}
                        </div>
                      )}
                      <div className="reviewer-details">
                        <h4>{review.userId.firstName} {review.userId.lastName}</h4>
                        <p className="review-date">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    <Rating value={review.rating} precision={0.5} readOnly />
                  </div>
                  <p className="review-text">{review.text}</p>
                  <Divider sx={{ margin: '20px 0' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reviews">
              <p>No reviews yet. Be the first to review this property!</p>
            </div>
          )}
        </div>
        <hr />

        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing.amenities[0].split(",").map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {
                      facilities.find((facility) => facility.name === item)
                        ?.icon
                    }
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DateRange ranges={dateRange} onChange={handleSelect} />
              {dayCount > 1 ? (
                <h2>
                  ₹{listing.price} x {dayCount} nights
                </h2>
              ) : (
                <h2>
                  ₹{listing.price} x {dayCount} night
                </h2>
              )}

              <h2>Total price: ₹{listing.price * dayCount}</h2>
              <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
              <p>End Date: {dateRange[0].endDate.toDateString()}</p>

              <button className="button" type="submit" onClick={handleSubmit}>
                BOOK NOW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog 
        open={showPaymentModal} 
        onClose={handlePaymentCancel}
        maxWidth="md"
        fullWidth
      >
        {currentBooking && (
          <StripeWrapper 
            booking={currentBooking}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        )}
      </Dialog>
      
      {/* Review Modal */}
      <PropertyReview
        open={showReviewModal}
        onClose={handleCloseReviewModal}
        property={listing}
        onSubmitReview={handleSubmitReview}
      />

      <Footer />
    </>
  );
};

export default ListingDetails;
