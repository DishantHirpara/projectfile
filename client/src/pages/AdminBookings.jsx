import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const getStatusColor = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) return 'info'; // Upcoming
  if (now >= start && now <= end) return 'success'; // Active
  return 'default'; // Completed
};

const getStatusText = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) return 'Upcoming';
  if (now >= start && now <= end) return 'Active';
  return 'Completed';
};

const AdminBookings = () => {
  const token = useSelector((state) => state.token);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteClick = (booking) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBooking) return;
    
    try {
      const response = await fetch(`http://localhost:3001/admin/bookings/${selectedBooking._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }
      
      // Update local state by removing the deleted booking
      setBookings(bookings.filter(booking => booking._id !== selectedBooking._id));
      
      setSnackbar({
        open: true,
        message: 'Booking deleted successfully',
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Error deleting booking:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete booking',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedBooking(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Manage Bookings</Typography>
      
      <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Property</TableCell>
                    <TableCell>Host</TableCell>
                    <TableCell>Check In</TableCell>
                    <TableCell>Check Out</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Booked On</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((booking) => (
                      <TableRow key={booking._id} hover>
                        <TableCell>
                          {booking.customerId ? 
                            `${booking.customerId.firstName} ${booking.customerId.lastName}` : 
                            'Unknown'}
                        </TableCell>
                        <TableCell>
                          {booking.listingId ? booking.listingId.title : 'Unknown Property'}
                        </TableCell>
                        <TableCell>
                          {booking.hostId ? 
                            `${booking.hostId.firstName} ${booking.hostId.lastName}` : 
                            'Unknown'}
                        </TableCell>
                        <TableCell>{formatDate(booking.startDate)}</TableCell>
                        <TableCell>{formatDate(booking.endDate)}</TableCell>
                        <TableCell>₹{booking.totalPrice}</TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusText(booking.startDate, booking.endDate)} 
                            color={getStatusColor(booking.startDate, booking.endDate)} 
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(booking.createdAt)}</TableCell>
                        <TableCell>
                          <IconButton color="error" onClick={() => handleDeleteClick(booking)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={bookings.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this booking? This action cannot be undone.
          </DialogContentText>
          {selectedBooking && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Booking Details:</Typography>
              <Typography variant="body2">
                Property: {selectedBooking.listingId?.title || 'Unknown'}
              </Typography>
              <Typography variant="body2">
                Dates: {formatDate(selectedBooking.startDate)} - {formatDate(selectedBooking.endDate)}
              </Typography>
              <Typography variant="body2">
                Customer: {selectedBooking.customerId ? 
                  `${selectedBooking.customerId.firstName} ${selectedBooking.customerId.lastName}` : 
                  'Unknown'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminBookings; 