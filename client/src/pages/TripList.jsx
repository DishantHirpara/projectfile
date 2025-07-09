import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import { Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton, Typography, Box } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import StripeWrapper from "../components/StripeWrapper";
import ReceiptIcon from '@mui/icons-material/Receipt';
import InvoiceGenerator from '../components/InvoiceGenerator';

const TripList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceBooking, setInvoiceBooking] = useState(null);
  
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const tripList = useSelector((state) => state.user.tripList);

  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/bookings/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      dispatch(setTripList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Trip List failed!", err.message);
    }
  };

  useEffect(() => {
    getTripList();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'info';
      default:
        return 'default';
    }
  };

  const handlePayment = (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    getTripList(); // Refresh the list to show updated payment status
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };

  const handleDeleteClick = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteDialog(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setBookingToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!bookingToDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/bookings/${bookingToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Refresh trip list after successful deletion
        getTripList();
      } else {
        console.error('Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    } finally {
      setShowDeleteDialog(false);
      setBookingToDelete(null);
    }
  };

  const handleViewInvoice = (booking) => {
    setInvoiceBooking(booking);
    setShowInvoiceModal(true);
  };

  const handleCloseInvoice = () => {
    setShowInvoiceModal(false);
    setInvoiceBooking(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div className="listings-container">
        <h1 className="title-list">Your Trip List</h1>
        <div className="list">
          {tripList?.map((booking) => (
            <div key={booking._id} className="trip-item">
              <div 
                className="listing-card" 
                onClick={() => {
                  navigate(`/bookings/${booking._id}`);
                }}
              >
                <div className="slider-container">
                  <div className="slider">
                    {booking.listingId.listingPhotoPaths?.map((photo, index) => (
                      <div key={index} className="slide">
                        <img
                          src={`http://localhost:3001/${photo?.replace("public", "")}`}
                          alt={`photo ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="card-content">
                  <h3>
                    {booking.listingId.city}, {booking.listingId.province}, {booking.listingId.country}
                  </h3>
                  <p>{booking.listingId.category}</p>
                  <p>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                  <p>
                    <span>₹{booking.totalPrice}</span> total
                  </p>
                  
                  <div className="booking-actions">
                    <Chip 
                      label={booking.paymentStatus || 'pending'} 
                      color={getStatusColor(booking.paymentStatus)} 
                      size="small"
                      sx={{ marginRight: '8px' }}
                    />
                    
                    <div className="action-buttons">
                      {(booking.paymentStatus === 'paid' || booking.paymentMethod === 'cash') && (
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewInvoice(booking);
                          }}
                          aria-label="view invoice"
                          size="small"
                        >
                          <ReceiptIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton 
                        color="error" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(booking);
                        }}
                        aria-label="delete booking"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                  
                  {booking.paymentStatus === 'pending' && !booking.paymentMethod && (
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePayment(booking);
                      }}
                      fullWidth
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      Complete Payment
                    </Button>
                  )}
                  
                  {booking.paymentMethod === 'cash' && booking.paymentStatus === 'pending' && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Cash payment will be collected on arrival
                    </Typography>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog 
        open={showPaymentModal} 
        onClose={handlePaymentCancel}
        maxWidth="md"
        fullWidth
      >
        {selectedBooking && (
          <StripeWrapper 
            booking={selectedBooking}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this booking?
            {bookingToDelete?.paymentStatus === 'paid' && (
              <span style={{ display: 'block', marginTop: '10px', fontWeight: 'bold' }}>
                Note: This booking has been paid. Canceling will issue a refund.
              </span>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>No, Keep It</Button>
          <Button onClick={handleDeleteConfirm} color="error">Yes, Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Invoice Modal */}
      <Dialog 
        open={showInvoiceModal}
        onClose={handleCloseInvoice}
        maxWidth="md"
        fullWidth
      >
        {invoiceBooking && (
          <InvoiceGenerator booking={invoiceBooking} onClose={handleCloseInvoice} />
        )}
      </Dialog>
      
      <Footer />
    </>
  );
};

export default TripList;
