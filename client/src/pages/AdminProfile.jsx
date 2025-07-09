import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLogin } from "../redux/state";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { PhotoCamera } from "@mui/icons-material";

const AdminProfile = () => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    user?.profileImagePath
      ? `http://localhost:3001/${user.profileImagePath.replace("public", "")}`
      : null
  );

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Only include fields that have changed
      if (formData.firstName !== user.firstName) {
        formDataToSend.append("firstName", formData.firstName);
      }
      
      if (formData.lastName !== user.lastName) {
        formDataToSend.append("lastName", formData.lastName);
      }
      
      if (formData.email !== user.email) {
        formDataToSend.append("email", formData.email);
      }
      
      if (formData.phone !== user.phone) {
        formDataToSend.append("phone", formData.phone);
      }
      
      if (formData.password) {
        formDataToSend.append("password", formData.password);
      }
      
      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
      }
      
      const response = await fetch(`http://localhost:3001/users/${user._id}/update`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      
      const updatedUser = await response.json();
      
      if (response.ok) {
        // Update user in Redux store
        dispatch(
          setLogin({
            user: updatedUser.user,
            token: token,
          })
        );
        
        setSnackbar({
          open: true,
          message: 'Profile updated successfully',
          severity: 'success'
        });
        
        // Reset password fields
        setFormData({
          ...formData,
          password: "",
          confirmPassword: ""
        });
      } else {
        setSnackbar({
          open: true,
          message: updatedUser.error || 'Failed to update profile',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbar({
        open: true,
        message: 'An error occurred while updating your profile',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Admin Profile</Typography>
      
      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ position: 'relative', mb: 3 }}>
                {previewImage ? (
                  <Avatar 
                    src={previewImage} 
                    alt={user?.firstName} 
                    sx={{ width: 150, height: 150, border: '4px solid #7367f0' }} 
                  />
                ) : (
                  <Avatar 
                    sx={{ width: 150, height: 150, bgcolor: '#7367f0', fontSize: '3rem' }}
                  >
                    {user?.firstName?.[0] || 'A'}
                  </Avatar>
                )}
                <label htmlFor="profile-image-input">
                  <input
                    type="file"
                    accept="image/*"
                    id="profile-image-input"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <Button 
                    component="span"
                    variant="contained" 
                    color="primary" 
                    sx={{ 
                      minWidth: 'auto', 
                      p: '8px', 
                      position: 'absolute', 
                      bottom: 0, 
                      right: 0, 
                      borderRadius: '50%' 
                    }}
                  >
                    <PhotoCamera />
                  </Button>
                </label>
              </Box>
              <Typography variant="h6" gutterBottom>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                {user?.email}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {user?.isAdmin ? 'Administrator' : 'User'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    type="number"
                    inputProps={{ 
                      maxLength: 10,
                      pattern: "[0-9]{10}",
                      inputMode: "numeric",
                      onInput: (e) => {
                        e.target.value = e.target.value.slice(0, 10);
                      }
                    }}
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Change Password
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="New Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
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

export default AdminProfile; 