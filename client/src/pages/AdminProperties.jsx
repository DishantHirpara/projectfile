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
  Avatar,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { Delete, Visibility, Edit } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const AdminProperties = () => {
  const token = useSelector((state) => state.token);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    type: '',
    city: '',
    province: '',
    country: '',
    highlight: '',
    highlightDesc: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/admin/listings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [token]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (property) => {
    setSelectedProperty(property);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (property) => {
    setSelectedProperty(property);
    setEditForm({
      title: property.title || '',
      description: property.description || '',
      price: property.price || '',
      category: property.category || '',
      type: property.type || '',
      city: property.city || '',
      province: property.province || '',
      country: property.country || '',
      highlight: property.highlight || '',
      highlightDesc: property.highlightDesc || ''
    });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async () => {
    if (!selectedProperty) return;
    
    try {
      const response = await fetch(`http://localhost:3001/admin/listings/${selectedProperty._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update property');
      }
      
      // Get the updated property
      const updatedProperty = await response.json();
      
      // Update properties array with the updated property
      setProperties(properties.map(prop => 
        prop._id === updatedProperty._id ? updatedProperty : prop
      ));
      
      setSnackbar({
        open: true,
        message: 'Property updated successfully',
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Error updating property:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update property',
        severity: 'error'
      });
    } finally {
      setEditDialogOpen(false);
      setSelectedProperty(null);
    }
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setSelectedProperty(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProperty) return;
    
    try {
      const response = await fetch(`http://localhost:3001/admin/listings/${selectedProperty._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete property');
      }
      
      // Refresh property list
      fetchProperties();
      
      setSnackbar({
        open: true,
        message: 'Property deleted successfully',
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Error deleting property:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete property',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedProperty(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedProperty(null);
  };

  const handleViewProperty = (id) => {
    window.open(`/properties/${id}`, '_blank');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Manage Properties</Typography>
      
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
                    <TableCell>Property</TableCell>
                    <TableCell>Host</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {properties
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((property) => (
                      <TableRow key={property._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              src={`http://localhost:3001/${property.listingPhotoPaths[0]}`} 
                              alt={property.title}
                              sx={{ width: 40, height: 40, mr: 2 }}
                              variant="rounded"
                            />
                            <Typography variant="body2">{property.title}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {property.creator ? 
                            `${property.creator.firstName} ${property.creator.lastName}` : 
                            'Unknown'}
                        </TableCell>
                        <TableCell>
                          {property.location && property.location.city && property.location.country ? 
                            `${property.location.city}, ${property.location.country}` : 
                            `${property.city}, ${property.country}`}
                        </TableCell>
                        <TableCell>₹{property.price}/night</TableCell>
                        <TableCell>
                          <Chip 
                            label={property.type} 
                            size="small" 
                            variant="outlined" 
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>{new Date(property.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleViewProperty(property._id)}>
                            <Visibility />
                          </IconButton>
                          <IconButton color="primary" onClick={() => handleEditClick(property)}>
                            <Edit />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteClick(property)}>
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
              count={properties.length}
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
        <DialogTitle>Delete Property</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedProperty?.title}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Property Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Property</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price per night"
                name="price"
                type="number"
                value={editForm.price}
                onChange={handleEditChange}
                margin="normal"
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>₹</span>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  label="Category"
                >
                  <MenuItem value="Beachfront">Beachfront</MenuItem>
                  <MenuItem value="Windmills">Windmills</MenuItem>
                  <MenuItem value="Iconic cities">Iconic cities</MenuItem>
                  <MenuItem value="Countryside">Countryside</MenuItem>
                  <MenuItem value="Amazing Pools">Amazing Pools</MenuItem>
                  <MenuItem value="Islands">Islands</MenuItem>
                  <MenuItem value="Lakefront">Lakefront</MenuItem>
                  <MenuItem value="Ski-in/out">Ski-in/out</MenuItem>
                  <MenuItem value="Castles">Castles</MenuItem>
                  <MenuItem value="Caves">Caves</MenuItem>
                  <MenuItem value="Camping">Camping</MenuItem>
                  <MenuItem value="Arctic">Arctic</MenuItem>
                  <MenuItem value="Desert">Desert</MenuItem>
                  <MenuItem value="Barns">Barns</MenuItem>
                  <MenuItem value="Luxury">Luxury</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={editForm.type}
                  onChange={handleEditChange}
                  label="Type"
                >
                  <MenuItem value="An entire place">An entire place</MenuItem>
                  <MenuItem value="Room(s)">Room(s)</MenuItem>
                  <MenuItem value="A Shared Room">A Shared Room</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={editForm.city}
                onChange={handleEditChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Province/State"
                name="province"
                value={editForm.province}
                onChange={handleEditChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={editForm.country}
                onChange={handleEditChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Highlight"
                name="highlight"
                value={editForm.highlight}
                onChange={handleEditChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Highlight Description"
                name="highlightDesc"
                value={editForm.highlightDesc}
                onChange={handleEditChange}
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary" variant="contained">Save Changes</Button>
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

export default AdminProperties; 