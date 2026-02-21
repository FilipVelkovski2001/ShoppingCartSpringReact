package com.abysalto.mid.controller;

import com.abysalto.mid.dto.request.AddItem;
import com.abysalto.mid.dto.response.ApiResponse;
import com.abysalto.mid.dto.response.CartDto;
import com.abysalto.mid.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart(
            @AuthenticationPrincipal UserDetails userDetails) {
        CartDto cart = cartService.getCart(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartDto>> addItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddItem request) {
        CartDto cart = cartService.addItem(userDetails.getUsername(), request);
        return ResponseEntity.ok(
                ApiResponse.success("Item added to cart", cart));
    }

    @PatchMapping("/items/{productId}")
    public ResponseEntity<ApiResponse<CartDto>> updateQuantity(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer productId, @RequestParam Integer quantity) {
        CartDto cart = cartService.updateItemQuantity(userDetails.getUsername(),
                productId, quantity);
        return ResponseEntity.ok(ApiResponse.success("Cart updated", cart));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<ApiResponse<CartDto>> removeItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer productId) {
        CartDto cart =
                cartService.removeItem(userDetails.getUsername(), productId);
        return ResponseEntity.ok(
                ApiResponse.success("Item removed from cart", cart));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(
            @AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }
}