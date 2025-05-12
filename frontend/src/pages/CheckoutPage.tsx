import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StripeWrapper from '../components/StripeWrapper';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutPageProps {
  cart: CartItem[];
  clearCart: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState<'one-time' | 'subscription'>('one-time');
  const [error, setError] = useState<string | null>(null);

  // Calculate total from cart
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePaymentSuccess = async () => {
    try {
      if (paymentType === 'subscription') {
        // Handle subscription creation
        const response = await fetch('http://localhost:8080/api/payments/create-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: total,
            currency: 'usd',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create subscription');
        }
      }

      // Navigate to success page
      clearCart();
      navigate('/payment-success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Checkout</h2>
          
          {/* Payment Type Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Payment Type
            </label>
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-md ${
                  paymentType === 'one-time'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setPaymentType('one-time')}
              >
                One-time Payment
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  paymentType === 'subscription'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setPaymentType('subscription')}
              >
                Subscription
              </button>
            </div>
          </div>

          {/* Amount Display */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Amount</h3>
            <p className="text-2xl font-bold text-gray-900">
              ${total.toFixed(2)}
              {paymentType === 'subscription' && ' /month'}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Prevent checkout if cart is empty or total is 0 */}
          {total <= 0 ? (
            <div className="mb-6 p-4 bg-yellow-100 text-yellow-700 rounded-md">
              Your cart is empty. Please add items before checking out.
            </div>
          ) : (
            <StripeWrapper
              amount={total}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 