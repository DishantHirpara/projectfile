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
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Chip,
  Tooltip,
  Collapse,
  List,
  ListItem,
  ListItemText,
  TextField,
  FormControlLabel,
  Switch
} from '@mui/material';
import { Delete, Edit, ExpandMore, ExpandLess, Home } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const AdminUsers = () => {
  const token = useSelector((state) => state.token);
  const [users, setUsers] = useState([]);
  const [userProperties, setUserProperties] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    isAdmin: false
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProperties = async (userId) => {
    if (userProperties[userId]) return; // Don't fetch if we already have the properties
    
    try {
      const response = await fetch(`http://localhost:3001/listings/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user properties');
      }
      
      const data = await response.json();
      setUserProperties(prev => ({
        ...prev,
        [userId]: data
      }));
    } catch (error) {
      console.error('Error fetching user properties:', error);
      setUserProperties(prev => ({
        ...prev,
        [userId]: []
      }));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`http://localhost:3001/admin/users/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      // Refresh user list
      fetchUsers();
      
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleExpandClick = (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
      fetchUserProperties(userId);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin
    });
    setEditDialogOpen(true);
  };

  const handleEditChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSubmit = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`http://localhost:3001/admin/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      // Refresh user list
      fetchUsers();
      
      setEditDialogOpen(false);
      setSelectedUser(null);
      setSnackbar({
        open: true,
        message: 'User updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating user:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update user',
        severity: 'error'
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Manage Users</Typography>
      
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
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="center">Admin Status</TableCell>
                    <TableCell align="center">Properties</TableCell>
                    <TableCell>Bookings</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <React.Fragment key={user._id}>
                        <TableRow hover>
                          <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={user.isAdmin ? 'Admin' : 'User'} 
                              color={user.isAdmin ? 'primary' : 'default'}
                              variant={user.isAdmin ? 'filled' : 'outlined'}
                              sx={{ fontWeight: user.isAdmin ? 'bold' : 'normal' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="body2" sx={{ mr: 1 }}>
                                {user.propertyList?.length || 0}
                              </Typography>
                              {(user.propertyList?.length > 0) && (
                                <Tooltip title="View Properties">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleExpandClick(user._id)}
                                    aria-label="show properties"
                                  >
                                    {expandedUser === user._id ? <ExpandLess /> : <ExpandMore />}
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>{(user.tripList?.length || 0) + (user.reservationList?.length || 0)}</TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <IconButton 
                              color="primary" 
                              onClick={() => handleEditClick(user)}
                              sx={{ mr: 1 }}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton 
                              color="error" 
                              onClick={() => handleDeleteClick(user)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        
                        {/* Expanded row for properties */}
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                            <Collapse in={expandedUser === user._id} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 2 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                  Properties
                                </Typography>
                                {userProperties[user._id]?.length > 0 ? (
                                  <List>
                                    {userProperties[user._id]?.map((property) => (
                                      <ListItem key={property._id} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
                                        <Home sx={{ mr: 2, color: 'primary.main' }} />
                                        <ListItemText 
                                          primary={property.title} 
                                          secondary={
                                            <Box>
                                              <Typography variant="body2" component="span" sx={{ display: 'block' }}>
                                                {property.location}
                                              </Typography>
                                              <Typography variant="body2" component="span" sx={{ display: 'block' }}>
                                                Price: ₹{property.price} per night
                                              </Typography>
                                              <Typography variant="body2" component="span" sx={{ display: 'block' }}>
                                                Category: {property.category}
                                              </Typography>
                                            </Box>
                                          }
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                ) : (
                                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                    {userProperties[user._id] ? 'No properties found' : 'Loading properties...'}
                                  </Typography>
                                )}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={users.length}
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
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedUser?.firstName} {selectedUser?.lastName}? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            name="firstName"
            value={editForm.firstName}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            name="lastName"
            value={editForm.lastName}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={editForm.email}
            onChange={handleEditChange}
          />
          <FormControlLabel
            control={
              <Switch
                checked={editForm.isAdmin}
                onChange={handleEditChange}
                name="isAdmin"
              />
            }
            label="Admin Status"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsers;