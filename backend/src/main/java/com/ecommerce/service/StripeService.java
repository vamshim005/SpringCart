package com.ecommerce.service;

import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.stereotype.Service;
import com.stripe.Stripe;
import com.stripe.net.Webhook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class StripeService {
    private static final Logger logger = LoggerFactory.getLogger(StripeService.class);
    
    public PaymentIntent createPaymentIntent(Long amount, String currency) throws StripeException {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency(currency)
                .setAutomaticPaymentMethods(
                    PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                        .setEnabled(true)
                        .build()
                )
                .build();
        
        return PaymentIntent.create(params);
    }
    
    public PaymentIntent confirmPaymentIntent(String paymentIntentId) throws StripeException {
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        return paymentIntent.confirm();
    }

    public Event constructEvent(String payload, String sigHeader, String webhookSecret) throws StripeException {
        return Webhook.constructEvent(payload, sigHeader, webhookSecret);
    }

    public void handlePaymentIntentSucceeded(PaymentIntent paymentIntent) {
        // Handle successful payment
        logger.info("Payment succeeded for payment intent: {}", paymentIntent.getId());
        // TODO: Update order status, send confirmation email, etc.
    }

    public void handlePaymentIntentFailed(PaymentIntent paymentIntent) {
        // Handle failed payment
        logger.error("Payment failed for payment intent: {}", paymentIntent.getId());
        // TODO: Update order status, notify customer, etc.
    }
} 