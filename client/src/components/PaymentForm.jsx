import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Alert,
  Divider,
  Tabs,
  Tab,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import MoneyIcon from '@mui/icons-material/Money';

const cardStyle = {
  style: {
    base: {
      color: '#424770',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#dc3545',
      iconColor: '#dc3545',
    },
  },
};

const PaymentForm = ({ booking, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const token = useSelector((state) => state.token);
  
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [upiId, setUpiId] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Calculate GST (18%)
  const basePrice = booking.totalPrice / 1.18; // Reverse calculate base price
  const gstAmount = booking.totalPrice - basePrice;
  const formattedBasePrice = basePrice.toFixed(2);
  const formattedGstAmount = gstAmount.toFixed(2);

  useEffect(() => {
    // Create PaymentIntent as soon as the component loads
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('http://localhost:3001/payments/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            amount: booking.totalPrice,
            bookingId: booking._id,
            currency: 'inr' // Changed to INR for Indian payments
          }),
        });

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setError('Failed to initialize payment. Please try again.');
      }
    };

    if (booking && token) {
      createPaymentIntent();
    }
  }, [booking, token]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Set payment method based on tab
    if (newValue === 0) setPaymentMethod('card');
    else if (newValue === 1) setPaymentMethod('upi');
    else setPaymentMethod('cash');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    try {
      let paymentResult = { succeeded: false, paymentIntentId: null };

      if (paymentMethod === 'card') {
        if (!stripe || !elements) {
          setError('Stripe has not loaded yet. Please try again.');
          setProcessing(false);
          return;
        }

        const cardElement = elements.getElement(CardElement);

        // Use Stripe to confirm the payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${booking.customerId?.firstName} ${booking.customerId?.lastName}`,
            },
          },
        });

        if (error) {
          throw new Error(`Payment failed: ${error.message}`);
        }

        if (paymentIntent.status === 'succeeded') {
          paymentResult = { succeeded: true, paymentIntentId: paymentIntent.id };
        }
      } else if (paymentMethod === 'upi') {
        // For demo purposes, we'll simulate a UPI payment success
        if (!upiId || !upiId.includes('@')) {
          throw new Error('Please enter a valid UPI ID (e.g., name@upi)');
        }
        
        // In a real implementation, you would integrate with a UPI payment gateway
        // Here we simulate a success with a fake payment intent ID
        paymentResult = { succeeded: true, paymentIntentId: `upi_${Date.now()}` };
      } else if (paymentMethod === 'cash') {
        // For cash payments, we mark it as pending but with a special status
        paymentResult = { succeeded: true, paymentIntentId: `cash_${Date.now()}` };
      }

      if (paymentResult.succeeded) {
        // Update the booking with payment information
        const bookingResponse = await fetch(`http://localhost:3001/bookings/${booking._id}/payment-status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
            paymentIntentId: paymentResult.paymentIntentId,
            paymentMethod: paymentMethod
          }),
        });

        if (bookingResponse.ok) {
          setSucceeded(true);
          setError(null);
          if (onSuccess) onSuccess(paymentResult);
        } else {
          throw new Error('Failed to update booking status');
        }
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      setError(err.message || 'An error occurred during payment processing');
    }
    
    setProcessing(false);
  };

  const renderPaymentOption = () => {
    switch (tabValue) {
      case 0: // Card
        return (
          <Box 
            sx={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: 1, 
              p: 2, 
              mb: 2 
            }}
          >
            <CardElement options={cardStyle} />
          </Box>
        );
      case 1: // UPI
        return (
          <Box sx={{ mt: 2, mb: 2 }}>
            <TextField
              label="Enter UPI ID"
              placeholder="username@upi"
              fullWidth
              variant="outlined"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              Enter your UPI ID to make an instant payment. You will receive a payment request on your UPI app.
            </Typography>
          </Box>
        );
      case 2: // Cash
        return (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              Pay in cash upon arrival. Please note:
            </Typography>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Your booking will be marked as "pending" until payment is received</li>
              <li>Please have the exact amount ready</li>
              <li>A receipt will be provided upon payment</li>
            </ul>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Complete Your Payment
      </Typography>
      
      <Box sx={{ my: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Booking Summary
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body1">
            {booking.listingId?.title || 'Property'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Price breakdown with GST */}
        <Typography variant="subtitle2" gutterBottom>
          Price Details
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2">Base Price</Typography>
          <Typography variant="body2">₹{formattedBasePrice}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2">GST (18%)</Typography>
          <Typography variant="body2">₹{formattedGstAmount}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, fontWeight: 'bold' }}>
          <Typography variant="body1">Total</Typography>
          <Typography variant="body1">₹{booking.totalPrice}</Typography>
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {succeeded ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          {paymentMethod === 'cash' 
            ? 'Booking confirmed! Please pay in cash upon arrival.' 
            : 'Payment successful! Your booking is confirmed.'}
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <Typography variant="subtitle1" gutterBottom>
            Payment Method
          </Typography>
          
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            sx={{ mb: 2 }}
          >
            <Tab icon={<CreditCardIcon />} label="Card" />
            <Tab icon={<PhoneAndroidIcon />} label="UPI" />
            <Tab icon={<MoneyIcon />} label="Cash" />
          </Tabs>
          
          {renderPaymentOption()}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={onCancel}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={processing || succeeded || (paymentMethod === 'card' && !stripe)}
            >
              {processing ? (
                <CircularProgress size={24} />
              ) : (
                paymentMethod === 'cash' 
                  ? 'Confirm Cash Payment' 
                  : `Pay ₹${booking.totalPrice}`
              )}
            </Button>
          </Box>
        </form>
      )}
    </Paper>
  );
};

export default PaymentForm; 