import React from 'react';
import { Container, Typography, Box, Paper, Breadcrumbs, Link, Divider } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/TermsAndConditions.scss';

const ReturnRefundPolicy = () => {
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
            Return and Refund Policy
          </Typography>
          
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />} 
            aria-label="breadcrumb"
            className="terms-breadcrumbs"
          >
            <Link color="inherit" href="/">Home</Link>
            <Typography color="textPrimary">Return and Refund Policy</Typography>
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
              At Shree Hari Rental Property, we understand that plans can change. This Return and Refund Policy outlines the terms and conditions for cancellations, refunds, and modifications of bookings made through our platform. By making a reservation through Shree Hari Rental Property, you agree to the terms of this policy.
            </Typography>
            <Typography variant="body1" paragraph>
              Please read this policy carefully before making a booking. If you have any questions, please contact our customer support team.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              2. Definitions
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>"Booking"</strong> refers to a reservation made by a guest for a specific property for a defined period.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>"Cancellation"</strong> refers to the termination of a confirmed booking before the check-in date.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>"Refund"</strong> refers to the return of funds paid for a booking that has been cancelled.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>"Modification"</strong> refers to changes made to an existing booking, such as dates, duration, or number of guests.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>"Cancellation Policy"</strong> refers to the specific terms under which a booking can be cancelled and a refund issued.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              3. Cancellation Policy Categories
            </Typography>
            <Typography variant="body1" paragraph>
              Each property on our platform falls under one of the following cancellation policy categories. The specific policy applicable to your booking will be clearly displayed before you confirm your reservation.
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              3.1. Flexible Policy
            </Typography>
            <Typography variant="body1" paragraph>
              • Full refund if cancelled at least 24 hours before check-in.
            </Typography>
            <Typography variant="body1" paragraph>
              • If cancelled less than 24 hours before check-in, the first night is non-refundable.
            </Typography>
            <Typography variant="body1" paragraph>
              • If the guest checks in and then decides to leave early, the nights not spent within 24 hours of notifying the host are 100% refunded.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              3.2. Moderate Policy
            </Typography>
            <Typography variant="body1" paragraph>
              • Full refund if cancelled at least 5 days before check-in.
            </Typography>
            <Typography variant="body1" paragraph>
              • If cancelled less than 5 days before check-in, the first night is non-refundable, plus 50% of the nights remaining.
            </Typography>
            <Typography variant="body1" paragraph>
              • If the guest checks in and then decides to leave early, 50% of the nights not spent are refunded.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              3.3. Strict Policy
            </Typography>
            <Typography variant="body1" paragraph>
              • Full refund if cancelled at least 14 days before check-in.
            </Typography>
            <Typography variant="body1" paragraph>
              • 50% refund if cancelled at least 7 days before check-in.
            </Typography>
            <Typography variant="body1" paragraph>
              • No refund if cancelled less than 7 days before check-in.
            </Typography>
            <Typography variant="body1" paragraph>
              • If the guest checks in and then decides to leave early, no refund for unused nights.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              3.4. Non-Refundable Option
            </Typography>
            <Typography variant="body1" paragraph>
              • Some properties may offer a non-refundable rate at a discounted price.
            </Typography>
            <Typography variant="body1" paragraph>
              • No refunds will be provided for cancellations of non-refundable bookings, regardless of when the cancellation is made.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              4. Refund Process
            </Typography>
            <Typography variant="body1" paragraph>
              4.1. All refunds will be processed back to the original payment method used for the booking.
            </Typography>
            <Typography variant="body1" paragraph>
              4.2. Processing times for refunds depend on your payment method:
            </Typography>
            <Typography variant="body1" paragraph sx={{ pl: 3 }}>
              • Credit/Debit Cards: 5-10 business days<br />
              • PayPal: 3-5 business days<br />
              • Bank Transfers: 7-10 business days
            </Typography>
            <Typography variant="body1" paragraph>
              4.3. Refund amounts will be calculated based on the applicable cancellation policy and the timing of your cancellation.
            </Typography>
            <Typography variant="body1" paragraph>
              4.4. Service fees may be non-refundable as specified at the time of booking.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              5. Booking Modifications
            </Typography>
            <Typography variant="body1" paragraph>
              5.1. Requests to modify a booking must be made through your account on our platform or by contacting our customer support team.
            </Typography>
            <Typography variant="body1" paragraph>
              5.2. Modifications are subject to availability and may result in price changes.
            </Typography>
            <Typography variant="body1" paragraph>
              5.3. If the modified booking costs more than the original booking, you will be required to pay the difference.
            </Typography>
            <Typography variant="body1" paragraph>
              5.4. If the modified booking costs less than the original booking, the difference will be refunded according to the property's cancellation policy.
            </Typography>
            <Typography variant="body1" paragraph>
              5.5. Modification requests made close to the check-in date may be treated as a cancellation and new booking, subject to the property's cancellation policy.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              6. Extenuating Circumstances
            </Typography>
            <Typography variant="body1" paragraph>
              6.1. In certain extenuating circumstances, we may override the property's cancellation policy and provide a full or partial refund.
            </Typography>
            <Typography variant="body1" paragraph>
              6.2. Extenuating circumstances may include, but are not limited to:
            </Typography>
            <Typography variant="body1" paragraph sx={{ pl: 3 }}>
              • Unexpected death or serious illness of a guest, host, or immediate family member<br />
              • Serious injury that directly impacts the guest's ability to travel<br />
              • Natural disasters or severe weather incidents affecting the destination<br />
              • Government-issued travel restrictions or advisories<br />
              • Property becoming uninhabitable due to damage or essential utility outages
            </Typography>
            <Typography variant="body1" paragraph>
              6.3. Documentation may be required to verify extenuating circumstances.
            </Typography>
            <Typography variant="body1" paragraph>
              6.4. The final decision regarding refunds under extenuating circumstances rests with Shree Hari Rental Property.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              7. Property Unavailability
            </Typography>
            <Typography variant="body1" paragraph>
              7.1. In the rare event that a property becomes unavailable after booking due to circumstances beyond the host's control, we will:
            </Typography>
            <Typography variant="body1" paragraph sx={{ pl: 3 }}>
              • Offer an alternative property of equal or greater value, if available<br />
              • Provide a full refund if no suitable alternative is available or acceptable to you
            </Typography>
            <Typography variant="body1" paragraph>
              7.2. If a property is significantly misrepresented or does not meet essential health and safety standards, you may be eligible for a full or partial refund.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              8. Early Departure
            </Typography>
            <Typography variant="body1" paragraph>
              8.1. If you choose to depart earlier than your scheduled check-out date, refunds for unused nights will be determined by the property's cancellation policy.
            </Typography>
            <Typography variant="body1" paragraph>
              8.2. No refunds will be provided for early departures due to personal preference, dislike of property, or circumstances not covered under extenuating circumstances.
            </Typography>
            <Typography variant="body1" paragraph>
              8.3. If early departure is necessary due to extenuating circumstances, please contact our customer support team immediately.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              9. Security Deposits
            </Typography>
            <Typography variant="body1" paragraph>
              9.1. Security deposits, if required, will be clearly stated at the time of booking.
            </Typography>
            <Typography variant="body1" paragraph>
              9.2. Security deposits will be refunded within 7 days after check-out, provided there is no damage to the property beyond normal wear and tear.
            </Typography>
            <Typography variant="body1" paragraph>
              9.3. If damages are found, the host must provide evidence and cost estimates. The guest will be notified before any deductions are made from the security deposit.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              10. Dispute Resolution
            </Typography>
            <Typography variant="body1" paragraph>
              10.1. If you disagree with a cancellation decision or refund amount, please contact our customer support team within 30 days of the cancellation.
            </Typography>
            <Typography variant="body1" paragraph>
              10.2. We will review the details of your case and work to reach a fair resolution.
            </Typography>
            <Typography variant="body1" paragraph>
              10.3. In the event of a dispute that cannot be resolved through our customer support, the matter may be referred to mediation or arbitration.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              11. Policy Modifications
            </Typography>
            <Typography variant="body1" paragraph>
              11.1. We reserve the right to modify this Return and Refund Policy at any time.
            </Typography>
            <Typography variant="body1" paragraph>
              11.2. Any changes will be effective immediately upon posting on our platform.
            </Typography>
            <Typography variant="body1" paragraph>
              11.3. Bookings made prior to policy changes will be subject to the policy in effect at the time of booking.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              12. Contact Information
            </Typography>
            <Typography variant="body1" paragraph>
              If you have any questions about our Return and Refund Policy, please contact us at:
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

export default ReturnRefundPolicy; 