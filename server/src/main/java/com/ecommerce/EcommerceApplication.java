package com.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.Arrays;

@SpringBootApplication
public class EcommerceApplication {
    public static void main(String[] args) {
        SpringApplication.run(EcommerceApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadSampleProducts(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                productRepository.saveAll(Arrays.asList(
                    new Product(null, "Wireless Mouse", "Ergonomic wireless mouse", new BigDecimal("19.99"), 50, "http://localhost:8080/img/img_1.jpg"),
                    new Product(null, "Mechanical Keyboard", "RGB backlit mechanical keyboard", new BigDecimal("59.99"), 30, "http://localhost:8080/img/img_2.jpg"),
                    new Product(null, "Noise Cancelling Headphones", "Over-ear noise cancelling headphones", new BigDecimal("89.99"), 20, "http://localhost:8080/img/img_4.jpg"),
                    new Product(null, "Portable SSD", "1TB USB 3.1 portable SSD", new BigDecimal("99.99"), 15, "http://localhost:8080/img/img_6.jpg"),
                    new Product(null, "Bluetooth Speaker", "Waterproof Bluetooth speaker", new BigDecimal("24.99"), 35, "http://localhost:8080/img/img_7.jpg"),
                    new Product(null, "Smartwatch", "Fitness tracking smartwatch", new BigDecimal("49.99"), 18, "http://localhost:8080/img/img_8.jpg"),
                    new Product(null, "Wireless Charger", "Fast wireless charging pad", new BigDecimal("14.99"), 60, "http://localhost:8080/img/img_9.jpg"),
                    new Product(null, "Laptop Stand", "Adjustable aluminum laptop stand", new BigDecimal("27.99"), 22, "http://localhost:8080/img/img_10.jpg"),
                    new Product(null, "Gaming Mousepad", "Large RGB gaming mousepad", new BigDecimal("15.99"), 45, "http://localhost:8080/img/img_11.jpg"),
                    new Product(null, "Action Camera", "4K waterproof action camera", new BigDecimal("79.99"), 12, "http://localhost:8080/img/img_12.jpg"),
                    new Product(null, "Smart Light Bulb", "WiFi-enabled color smart bulb", new BigDecimal("12.99"), 55, "http://localhost:8080/img/img_13.jpg"),
                    new Product(null, "Fitness Tracker", "Heart rate and sleep monitor", new BigDecimal("34.99"), 28, "http://localhost:8080/img/img_14.jpg"),
                    new Product(null, "Tablet Stand", "Universal adjustable tablet stand", new BigDecimal("13.99"), 38, "http://localhost:8080/img/img_15.jpg"),
                    new Product(null, "Wireless Earbuds", "Bluetooth 5.0 wireless earbuds", new BigDecimal("29.99"), 32, "http://localhost:8080/img/img_16.jpg"),
                    new Product(null, "Mini Projector", "Portable mini projector", new BigDecimal("59.99"), 10, "http://localhost:8080/img/img_19.jpg"),
                    new Product(null, "LED Desk Lamp", "Dimmable LED desk lamp", new BigDecimal("22.99"), 27, "http://localhost:8080/img/img_21.jpg"),
                    new Product(null, "Streaming Microphone", "USB condenser microphone", new BigDecimal("44.99"), 16, "http://localhost:8080/img/img_22.jpg"),
                    new Product(null, "VR Headset", "Virtual reality headset for phones", new BigDecimal("25.99"), 14, "http://localhost:8080/img/img_23.jpg"),
                    new Product(null, "External DVD Drive", "USB 3.0 external DVD drive", new BigDecimal("18.99"), 23, "http://localhost:8080/img/img_25.jpg"),
                    new Product(null, "Portable Monitor", "15.6\" USB-C portable monitor", new BigDecimal("109.99"), 7, "http://localhost:8080/img/img_28.jpg"),
                    new Product(null, "Wireless Presenter", "USB wireless presentation remote", new BigDecimal("16.99"), 36, "http://localhost:8080/img/img_29.jpg"),
                    new Product(null, "Bluetooth Tracker", "Key and wallet Bluetooth tracker", new BigDecimal("14.99"), 41, "http://localhost:8080/img/img_30.jpg")
                ));
            }
        };
    }
}
