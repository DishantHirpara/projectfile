import React, { useState } from 'react';
import "../styles/ContactUs.scss";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { TextField, Button, Paper, Typography, Container, Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import { LocationOn, LocalPhone, Email } from "@mui/icons-material";
import axios from 'axios';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Call the backend API
      await axios.post('http://localhost:3001/contact/submit', formData);
      
      // Show success message
      setSnackbarMessage('Thank you for your message! We will get back to you soon.');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      
      // Show error message
      setSnackbarMessage(error.response?.data?.message || 'Failed to submit your message. Please try again later.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" className="contact-us-container">
        <Typography variant="h3" component="h1" className="page-title">
          Contact Us
        </Typography>
        
        <Box className="contact-content">
          <Paper elevation={3} className="contact-info">
            <Typography variant="h5" gutterBottom>
              Get In Touch
            </Typography>
            <Typography variant="body1" paragraph>
              Have questions about Shree Hari Rental Property? We're here to help and answer any questions you might have.
            </Typography>
            
            <Box className="contact-detail">
              <LocationOn />
              <Typography>
                123 Dream Street, Vacation City, 10001
              </Typography>
            </Box>
            
            <Box className="contact-detail">
              <LocalPhone />
              <Typography>
                +91 234 567 890
              </Typography>
            </Box>
            
            <Box className="contact-detail">
              <Email />
              <Typography>
                shreeharirentals@support.com
              </Typography>
            </Box>
          </Paper>
          
          <Paper elevation={3} className="contact-form">
            <Typography variant="h5" gutterBottom>
              Send us a message
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                error={!!errors.name}
                helperText={errors.name}
                required
              />
              
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                error={!!errors.email}
                helperText={errors.email}
                required
              />
              
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                margin="normal"
                error={!!errors.subject}
                helperText={errors.subject}
                required
              />
              
              <TextField
                fullWidth
                label="Message"
                name="message"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
                margin="normal"
                error={!!errors.message}
                helperText={errors.message}
                required
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={submitting}
                className="submit-button"
              >
                {submitting ? (
                  <>
                    <CircularProgress size={24} color="inherit" style={{ marginRight: '8px' }} />
                    Sending...
                  </>
                ) : 'Send Message'}
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
      
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      <Footer />
    </>
  );
};

export default ContactUs; 