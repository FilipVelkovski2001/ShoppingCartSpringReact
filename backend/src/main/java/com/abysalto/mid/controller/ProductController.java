package com.abysalto.mid.controller;

import com.abysalto.mid.dto.response.ApiResponse;
import com.abysalto.mid.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllProducts(
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String order,
            @RequestParam(required = false) String search) {
        Map<String, Object> products =
                productService.getAllProducts(limit, skip, sortBy, order,
                        search);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductById(
            @PathVariable Integer id) {
        Map<String, Object> product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCategories() {
        Map<String, Object> categories = productService.getCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "0") int skip) {
        Map<String, Object> products =
                productService.getProductsByCategory(category, limit, skip);
        return ResponseEntity.ok(ApiResponse.success(products));
    }
}
