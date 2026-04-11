package com.felix.bms.service;

import com.felix.bms.dto.auth.AuthRequest;
import com.felix.bms.dto.auth.AuthResponse;
import com.felix.bms.dto.auth.RegisterRequest;
import com.felix.bms.dto.token.TokenRefreshRequest;
import com.felix.bms.entity.User;
import com.felix.bms.exception.InvalidRefreshTokenException;
import com.felix.bms.repository.UserRepository;
import com.felix.bms.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    // register or signup api
    // login api
    // refreshToken api
    @Value("${admin.email:admin@example.com}")
    private String adminEmail;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public void register(RegisterRequest registerRequest) throws BadRequestException {

        // Prevent creating another admin
        if (registerRequest.email().equals(adminEmail)  ) {
            throw new BadRequestException("Admin account creation is restricted");
        }

        if(userRepository.existsByEmail(registerRequest.email())){
            throw new RuntimeException("Email already in use");
        }

        User user=new User();
        user.setEmail(registerRequest.email());
        user.setPassword(passwordEncoder.encode(registerRequest.password()));
        user.setName(registerRequest.name());

        userRepository.save(user);

        log.info("User registered: {}", user.getEmail());
    }

    public AuthResponse login(AuthRequest authRequest){

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.email(),authRequest.password()));

        User user=userRepository.findByEmail(authRequest.email()).orElseThrow(()->  new UsernameNotFoundException("User not found"));

        String accessToken=jwtService.generateToken(createUserDetails(user));
        String refreshToken=refreshTokenService.createRefreshToken(user.getEmail()).getToken();

        log.info("User logged in: {}", user.getEmail());
        return new AuthResponse(accessToken, refreshToken);

    }

    public UserDetails createUserDetails(User user){
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_"+ user.getRole().name())
                .build();
    }

    public AuthResponse refreshToken(TokenRefreshRequest tokenRefreshRequest){
        String email = jwtService.extractUsername(tokenRefreshRequest.refreshToken());

        if (!refreshTokenService.isValidRefreshToken(tokenRefreshRequest.refreshToken(), email)) {
            throw new InvalidRefreshTokenException("Invalid or expired refresh token");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String newAccessToken = jwtService.generateToken(createUserDetails(user));
        String newRefreshToken = refreshTokenService.rotateRefreshToken(tokenRefreshRequest.refreshToken()).getToken();

        return new AuthResponse(newAccessToken,newRefreshToken);

    }

    public Long getCurrentUserId(String email){
       return userRepository.findIdByEmail(email);
    }
}
