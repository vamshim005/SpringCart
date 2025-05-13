package com.ecommerce.controller;

import com.ecommerce.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"https://shop.vamshimaya.com", "https://shop.vamshimaya.com"})
public class PaymentController {

    @Autowired
    private StripeService stripeService;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody Map<String, Object> payload) {
        try {
            Long amount = Long.parseLong(payload.get("amount").toString());
            String currency = (String) payload.get("currency");
            
            PaymentIntent paymentIntent = stripeService.createPaymentIntent(amount, currency);
            
            Map<String, String> responseData = new HashMap<>();
            responseData.put("clientSecret", paymentIntent.getClientSecret());
            
            return ResponseEntity.ok(responseData);
        } catch (StripeException e) {
            Map<String, String> errorData = new HashMap<>();
            errorData.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorData);
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            Event event = stripeService.constructEvent(payload, sigHeader, webhookSecret);
            
            // Handle the event
            switch (event.getType()) {
                case "payment_intent.succeeded":
                    PaymentIntent paymentIntent = (PaymentIntent) event.getData().getObject();
                    stripeService.handlePaymentIntentSucceeded(paymentIntent);
                    break;
                case "payment_intent.payment_failed":
                    PaymentIntent failedPaymentIntent = (PaymentIntent) event.getData().getObject();
                    stripeService.handlePaymentIntentFailed(failedPaymentIntent);
                    break;
                default:
                    // Unexpected event type
                    return ResponseEntity.badRequest().body("Unexpected event type: " + event.getType());
            }
            
            return ResponseEntity.ok("Webhook processed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Webhook Error: " + e.getMessage());
        }
    }

    @PostMapping("/save-card")
    public ResponseEntity<Map<String, String>> saveCard(@RequestBody Map<String, Object> payload) {
        try {
            // TODO: Implement card saving logic
            Map<String, String> response = new HashMap<>();
            response.put("message", "Card saved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/create-subscription")
    public ResponseEntity<Map<String, String>> createSubscription(@RequestBody Map<String, Object> payload) {
        try {
            // TODO: Implement subscription creation logic
            Map<String, String> response = new HashMap<>();
            response.put("message", "Subscription created successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 