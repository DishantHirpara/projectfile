import React from 'react';
import { Container, Typography, Box, Paper, Breadcrumbs, Link, Divider } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/TermsAndConditions.scss';

const TermsAndConditions = () => {
  const heroStyle = {
    background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/slide.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <>
      <Navbar />
      
      <div className="terms-hero" style={heroStyle}>
        <Container>
          <Typography variant="h2" component="h1" className="terms-title">
            Terms and Conditions
          </Typography>
          
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />} 
            aria-label="breadcrumb"
            className="terms-breadcrumbs"
          >
            <Link color="inherit" href="/">Home</Link>
            <Typography color="textPrimary">Terms and Conditions</Typography>
          </Breadcrumbs>
        </Container>
      </div>
      
      <Container maxWidth="lg" className="terms-container">
        <Paper elevation={1} className="terms-paper">
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              1. Introduction
            </Typography>
            <Typography variant="body1" paragraph>
              Welcome to Shree Hari Rental Property. These Terms and Conditions govern your use of our website and services, including the booking and rental of properties listed on our platform. By accessing or using our services, you agree to be bound by these Terms and Conditions.
            </Typography>
            <Typography variant="body1" paragraph>
              Please read these Terms and Conditions carefully before booking any property through our platform. If you do not agree with any part of these terms, please do not use our services.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              2. Definitions
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>"We", "Our", "Us"</strong> refers to Shree Hari Rental Property, its owners, employees, and representatives.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>"You", "Your", "Guest"</strong> refers to the user or visitor of our website, or the person who books or stays in a property.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>"Host"</strong> refers to property owners who list their properties on our platform.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>"Property"</strong> refers to any accommodation listed on our platform.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>"Booking"</strong> refers to a reservation made by a guest for a property.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              3. Account Registration
            </Typography>
            <Typography variant="body1" paragraph>
              3.1. To book a property or list your property as a host, you may need to create an account on our platform.
            </Typography>
            <Typography variant="body1" paragraph>
              3.2. You must provide accurate, current, and complete information during the registration process.
            </Typography>
            <Typography variant="body1" paragraph>
              3.3. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </Typography>
            <Typography variant="body1" paragraph>
              3.4. You must immediately notify us of any unauthorized use of your account or any other breach of security.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              4. Booking and Payments
            </Typography>
            <Typography variant="body1" paragraph>
              4.1. All bookings are subject to availability and acceptance by the host.
            </Typography>
            <Typography variant="body1" paragraph>
              4.2. When you make a booking, you agree to pay the full amount specified for that booking.
            </Typography>
            <Typography variant="body1" paragraph>
              4.3. Payment methods accepted are specified on our platform during the checkout process.
            </Typography>
            <Typography variant="body1" paragraph>
              4.4. Prices are inclusive of applicable taxes unless otherwise stated.
            </Typography>
            <Typography variant="body1" paragraph>
              4.5. Additional fees such as cleaning fees, service fees, or security deposits may apply and will be clearly displayed before confirming your booking.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              5. Cancellation and Refund Policy
            </Typography>
            <Typography variant="body1" paragraph>
              5.1. Cancellation policies vary by property and are displayed on the property listing before you make a booking.
            </Typography>
            <Typography variant="body1" paragraph>
              5.2. To cancel a booking, you must follow the cancellation process outlined on our platform.
            </Typography>
            <Typography variant="body1" paragraph>
              5.3. Refunds, if applicable, will be processed according to the property's cancellation policy.
            </Typography>
            <Typography variant="body1" paragraph>
              5.4. In the event of exceptional circumstances (e.g., natural disasters, government travel restrictions), special cancellation terms may apply.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              6. Guest Responsibilities
            </Typography>
            <Typography variant="body1" paragraph>
              6.1. Guests must comply with all property rules specified by the host.
            </Typography>
            <Typography variant="body1" paragraph>
              6.2. Guests are responsible for any damage caused to the property during their stay beyond normal wear and tear.
            </Typography>
            <Typography variant="body1" paragraph>
              6.3. The number of guests staying at the property must not exceed the maximum capacity specified in the listing.
            </Typography>
            <Typography variant="body1" paragraph>
              6.4. Guests must leave the property in a reasonably clean and tidy condition upon departure.
            </Typography>
            <Typography variant="body1" paragraph>
              6.5. Any illegal activities conducted on the property are strictly prohibited and may result in immediate termination of the stay without refund.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              7. Host Responsibilities
            </Typography>
            <Typography variant="body1" paragraph>
              7.1. Hosts must provide accurate information about their property in their listing.
            </Typography>
            <Typography variant="body1" paragraph>
              7.2. Hosts must ensure their property is clean, safe, and ready for guests upon check-in.
            </Typography>
            <Typography variant="body1" paragraph>
              7.3. Hosts must respect guests' privacy during their stay.
            </Typography>
            <Typography variant="body1" paragraph>
              7.4. Hosts must respond promptly to guest inquiries and issues.
            </Typography>
            <Typography variant="body1" paragraph>
              7.5. Hosts must comply with all applicable laws and regulations related to short-term rentals.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              8. Limitation of Liability
            </Typography>
            <Typography variant="body1" paragraph>
              8.1. We act as an intermediary platform between guests and hosts and are not responsible for the actions or omissions of either party.
            </Typography>
            <Typography variant="body1" paragraph>
              8.2. We do not own, manage, or control the properties listed on our platform.
            </Typography>
            <Typography variant="body1" paragraph>
              8.3. To the maximum extent permitted by law, we shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of our services.
            </Typography>
            <Typography variant="body1" paragraph>
              8.4. We are not responsible for any personal injury, property damage, or loss that occurs during your stay at a property.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              9. Intellectual Property
            </Typography>
            <Typography variant="body1" paragraph>
              9.1. All content on our platform, including text, graphics, logos, images, and software, is the property of Shree Hari Rental Property or its content suppliers and is protected by copyright and other intellectual property laws.
            </Typography>
            <Typography variant="body1" paragraph>
              9.2. You may not reproduce, distribute, modify, display, or create derivative works from any content on our platform without our prior written consent.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              10. Privacy Policy
            </Typography>
            <Typography variant="body1" paragraph>
              10.1. Our Privacy Policy, which explains how we collect, use, and protect your personal information, is incorporated into these Terms and Conditions by reference.
            </Typography>
            <Typography variant="body1" paragraph>
              10.2. By using our services, you consent to the collection and use of your information as described in our Privacy Policy.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              11. Modification of Terms
            </Typography>
            <Typography variant="body1" paragraph>
              11.1. We reserve the right to modify these Terms and Conditions at any time without prior notice.
            </Typography>
            <Typography variant="body1" paragraph>
              11.2. Updated terms will be posted on our website, and your continued use of our services after any changes indicates your acceptance of the modified terms.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              12. Governing Law
            </Typography>
            <Typography variant="body1" paragraph>
              12.1. These Terms and Conditions shall be governed by and construed in accordance with the laws of India.
            </Typography>
            <Typography variant="body1" paragraph>
              12.2. Any disputes arising under or in connection with these Terms and Conditions shall be subject to the exclusive jurisdiction of the courts of India.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              13. Contact Information
            </Typography>
            <Typography variant="body1" paragraph>
              If you have any questions about these Terms and Conditions, please contact us at:
            </Typography>
            <Typography variant="body1" paragraph>
              Email: shreeharirentals@support.com<br />
              Phone: +91 234 567 890<br />
              Address: 123 Dream Street, Vacation City, 10001
            </Typography>
            <Typography variant="body1" paragraph>
              Last updated: April 3, 2024
            </Typography>
          </Box>
        </Paper>
      </Container>
      
      <Footer />
    </>
  );
};

export default TermsAndConditions; 