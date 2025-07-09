import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

// Load Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51OH8N6SHC2qL1SMYpd6qLwSRyhCvKYawiTzNHtC3y9XdFBCbhhQvYfQIRc8HpZtBiQzCvefEfFmmZJdVlcFvNVNB00o8nO3d9y');

const StripeWrapper = ({ booking, onSuccess, onCancel }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm 
        booking={booking} 
        onSuccess={onSuccess} 
        onCancel={onCancel}
      />
    </Elements>
  );
};

export default StripeWrapper; 