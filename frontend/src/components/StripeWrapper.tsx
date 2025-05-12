import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

// Replace with your publishable key
const stripePromise = loadStripe('pk_test_51RNRK22UPUsh6WXC6tYxBTm6KJyFiJ35vX26EVjq8xU87FeyVbmOxVmibwaPpKM2A9DI56TjbxfNCwjRtyVGBYKA00Nt44E8pM');

interface StripeWrapperProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const StripeWrapper: React.FC<StripeWrapperProps> = ({ amount, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripeWrapper; 