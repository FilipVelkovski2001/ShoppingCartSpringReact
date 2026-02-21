package com.abysalto.mid.controller;

import com.abysalto.mid.dto.response.ApiResponse;
import com.abysalto.mid.dto.response.UserDto;
import com.abysalto.mid.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserDto user = userService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PostMapping("/favorites/{productId}")
    public ResponseEntity<ApiResponse<UserDto>> addToFavorites(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer productId) {
        UserDto user = userService.addToFavorites(userDetails.getUsername(),
                productId);
        return ResponseEntity.ok(
                ApiResponse.success("Product added to favorites", user));
    }

    @DeleteMapping("/favorites/{productId}")
    public ResponseEntity<ApiResponse<UserDto>> removeFromFavorites(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer productId) {
        UserDto user =
                userService.removeFromFavorites(userDetails.getUsername(),
                        productId);
        return ResponseEntity.ok(
                ApiResponse.success("Product removed from favorites", user));
    }
}
