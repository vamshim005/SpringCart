package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Comparator;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice,
        @RequestParam(required = false, defaultValue = "id") String sortBy,
        @RequestParam(required = false, defaultValue = "asc") String order
    ) {
        List<Product> products = productService.findAll(); // Start with all products

        // Filter by name
        if (name != null && !name.isEmpty()) {
            products = products.stream()
                .filter(p -> p.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(java.util.stream.Collectors.toList());
        }
        // Filter by min price
        if (minPrice != null) {
            products = products.stream()
                .filter(p -> p.getPrice().compareTo(minPrice) >= 0)
                .collect(java.util.stream.Collectors.toList());
        }
        // Filter by max price
        if (maxPrice != null) {
            products = products.stream()
                .filter(p -> p.getPrice().compareTo(maxPrice) <= 0)
                .collect(java.util.stream.Collectors.toList());
        }
        // Sort
        if (sortBy != null && !sortBy.isEmpty()) {
            Comparator<Product> comparator;
            switch (sortBy) {
                case "price":
                    comparator = Comparator.comparing(Product::getPrice);
                    break;
                case "name":
                    comparator = Comparator.comparing(Product::getName, String.CASE_INSENSITIVE_ORDER);
                    break;
                default:
                    comparator = Comparator.comparing(Product::getId);
                    break;
            }
            if ("desc".equalsIgnoreCase(order)) {
                comparator = comparator.reversed();
            }
            products = products.stream().sorted(comparator).collect(java.util.stream.Collectors.toList());
        }

        // Debug logging
        System.out.println("minPrice=" + minPrice + ", maxPrice=" + maxPrice);
        System.out.println("Products before filtering: " + productService.findAll().size());
        System.out.println("Products after filtering: " + products.size());

        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.save(product));
    }
} 