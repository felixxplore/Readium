package com.felix.bms.controller;

import com.felix.bms.dto.auth.AuthRequest;
import com.felix.bms.dto.auth.AuthResponse;
import com.felix.bms.dto.auth.GoogleOAuthRequest;
import com.felix.bms.dto.auth.RegisterRequest;
import com.felix.bms.dto.token.TokenRefreshRequest;
import com.felix.bms.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    // register or signup api
    // login api
    // refreshToken api

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest)   {
        authService.register(registerRequest);
        return ResponseEntity.ok("Verification email sent");
    }


    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String token, HttpServletResponse response) {
        authService.verifyEmail(token,response);
        return ResponseEntity.ok("Email verified");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest, HttpServletResponse response){
        return ResponseEntity.ok(authService.login(authRequest,response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        authService.refreshToken(request, response);
        return ResponseEntity.ok("Token refreshed");
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resend(@RequestBody String email) {

        authService.resendVerification(email);

        return ResponseEntity.ok("If account exists, verification email sent");
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> authenticateWithGoogle(@Valid @RequestBody GoogleOAuthRequest request) throws BadRequestException {
        return ResponseEntity.ok(authService.authenticateWithGoogle(request));
    }

}
