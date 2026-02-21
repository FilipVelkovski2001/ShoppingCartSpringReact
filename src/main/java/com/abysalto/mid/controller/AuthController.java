package com.abysalto.mid.controller;

import com.abysalto.mid.dto.request.Login;
import com.abysalto.mid.dto.request.Register;
import com.abysalto.mid.dto.response.ApiResponse;
import com.abysalto.mid.dto.response.AuthDto;
import com.abysalto.mid.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthDto>> register(
            @Valid @RequestBody Register request) {
        AuthDto response = authService.register(request);
        return ResponseEntity.ok(
                ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthDto>> login(
            @Valid @RequestBody Login request) {
        AuthDto response = authService.login(request);
        return ResponseEntity.ok(
                ApiResponse.success("Login successful", response));
    }
}
