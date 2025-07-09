import React, { useEffect, useState } from 'react';
import "../styles/AdminDashboard.scss";
import { 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar,
  Alert,
  IconButton,
  Modal,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { 
  AccessTime as AccessTimeIcon, 
  Email as EmailIcon, 
  VisibilityOutlined as VisibilityIcon,
  DeleteOutlined as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openModal, setOpenModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }

    fetchContacts();
  }, [user, navigate]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/contact/all');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setSnackbarMessage('Failed to load contacts');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      await axios.patch(`http://localhost:3001/contact/${contactId}/status`, {
        status: newStatus
      });
      
      // Update local state
      setContacts(contacts.map(contact => 
        contact._id === contactId 
          ? { ...contact, status: newStatus }
          : contact
      ));
      
      setSnackbarMessage('Status updated successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating status:', error);
      setSnackbarMessage('Failed to update status');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const openDeleteDialog = (contact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setContactToDelete(null);
  };

  const handleDeleteContact = async () => {
    if (!contactToDelete) return;
    
    try {
      await axios.delete(`http://localhost:3001/contact/${contactToDelete._id}`);
      
      // Update local state by removing the deleted contact
      setContacts(contacts.filter(contact => contact._id !== contactToDelete._id));
      
      setSnackbarMessage('Contact deleted successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      closeDeleteDialog();
    } catch (error) {
      console.error('Error deleting contact:', error);
      setSnackbarMessage('Failed to delete contact');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ff9800'; // Orange
      case 'in-progress':
        return '#2196f3'; // Blue
      case 'resolved':
        return '#4caf50'; // Green
      default:
        return '#9e9e9e'; // Grey
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Box className="admin-dashboard-container">
        <Typography variant="h4" component="h1" className="page-title">
          Manage Contact Submissions
        </Typography>

        <Paper elevation={3} className="admin-content">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">Loading...</TableCell>
                  </TableRow>
                ) : contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No contact submissions found</TableCell>
                  </TableRow>
                ) : (
                  contacts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((contact) => (
                      <TableRow key={contact._id}>
                        <TableCell>{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.subject}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <AccessTimeIcon fontSize="small" style={{ marginRight: '8px' }} />
                            {formatDate(contact.createdAt)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <FormControl fullWidth size="small">
                            <InputLabel id={`status-label-${contact._id}`}>Status</InputLabel>
                            <Select
                              labelId={`status-label-${contact._id}`}
                              value={contact.status}
                              label="Status"
                              onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                              renderValue={(selected) => (
                                <Chip 
                                  label={selected.charAt(0).toUpperCase() + selected.slice(1)} 
                                  size="small"
                                  style={{ 
                                    backgroundColor: getStatusColor(selected),
                                    color: 'white'
                                  }}
                                />
                              )}
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="in-progress">In Progress</MenuItem>
                              <MenuItem value="resolved">Resolved</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <Box display="flex">
                            <IconButton
                              color="primary"
                              onClick={() => handleViewContact(contact)}
                              title="View Details"
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => openDeleteDialog(contact)}
                              title="Delete Contact"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={contacts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      {/* Modal for viewing contact details */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="contact-detail-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" component="h2">
              Contact Details
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          
          {selectedContact && (
            <>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  From
                </Typography>
                <Box display="flex" alignItems="center" mt={0.5}>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedContact.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" ml={1}>
                    ({selectedContact.email})
                  </Typography>
                </Box>
              </Box>
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Subject
                </Typography>
                <Typography variant="body1">
                  {selectedContact.subject}
                </Typography>
              </Box>
              
              <Box mb={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Message
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ p: 2, mt: 0.5, bgcolor: '#f9f9f9', minHeight: '100px' }}
                >
                  <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedContact.message}
                  </Typography>
                </Paper>
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Received: {formatDate(selectedContact.createdAt)}
                  </Typography>
                </Box>
                <Box>
                  <FormControl size="small" sx={{ width: 150 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedContact.status}
                      label="Status"
                      onChange={(e) => handleStatusChange(selectedContact._id, e.target.value)}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Contact
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this contact submission from {contactToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteContact} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminContacts; 