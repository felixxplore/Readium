package com.felix.bms.controller;

import com.felix.bms.dto.auth.AuthRequest;
import com.felix.bms.dto.auth.AuthResponse;
import com.felix.bms.dto.auth.RegisterRequest;
import com.felix.bms.dto.token.TokenRefreshRequest;
import com.felix.bms.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    // register or signup api
    // login api
    // refreshToken api

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest registerRequest) throws BadRequestException {
         authService.register(registerRequest);
         return ResponseEntity.ok("User register successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest){
        return ResponseEntity.ok(authService.login(authRequest));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody TokenRefreshRequest tokenRefreshRequest){
        return ResponseEntity.ok(authService.refreshToken(tokenRefreshRequest));
    }

}
