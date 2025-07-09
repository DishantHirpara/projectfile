import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setReservationList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import { Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const ReservationList = () => {
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const reservationList = useSelector((state) => state.user.reservationList);

  const dispatch = useDispatch();

  const getReservationList = async () => {
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
      // Filter bookings where user is host
      const hostBookings = data.filter(booking => booking.hostId._id === userId);
      dispatch(setReservationList(hostBookings));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Reservation List failed!", err.message);
    }
  };

  useEffect(() => {
    getReservationList();
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
        // Refresh reservation list after successful deletion
        getReservationList();
      } else {
        console.error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
    } finally {
      setShowDeleteDialog(false);
      setBookingToDelete(null);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Reservation List</h1>
      <div className="list">
        {reservationList?.map((booking) => (
          <div key={booking._id} className="trip-item">
            <ListingCard
              listingId={booking.listingId._id}
              creator={booking.hostId._id}
              listingPhotoPaths={booking.listingId.listingPhotoPaths}
              city={booking.listingId.city}
              province={booking.listingId.province}
              country={booking.listingId.country}
              category={booking.listingId.category}
              startDate={booking.startDate}
              endDate={booking.endDate}
              totalPrice={booking.totalPrice}
              booking={true}
              guestInfo={`Guest: ${booking.customerId.firstName} ${booking.customerId.lastName}`}
              paymentStatus={`Payment: ${booking.paymentStatus || 'pending'}`}
              paymentStatusColor={getStatusColor(booking.paymentStatus)}
              onDelete={(e) => {
                e.stopPropagation();
                handleDeleteClick(booking);
              }}
              reservationView={true}
              bookingId={booking._id}
            />
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Cancel Reservation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel the reservation for 
            {bookingToDelete && ` ${bookingToDelete.customerId.firstName} ${bookingToDelete.customerId.lastName}`}?
            {bookingToDelete?.paymentStatus === 'paid' && (
              <span style={{ display: 'block', marginTop: '10px', fontWeight: 'bold' }}>
                Note: This booking has been paid. Canceling will issue a refund to the guest.
              </span>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>No, Keep It</Button>
          <Button onClick={handleDeleteConfirm} color="error">Yes, Cancel</Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
};

export default ReservationList;
