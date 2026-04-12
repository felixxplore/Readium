package com.felix.bms.service;

import com.felix.bms.dto.auth.AuthRequest;
import com.felix.bms.dto.auth.AuthResponse;
import com.felix.bms.dto.auth.GoogleOAuthRequest;
import com.felix.bms.dto.auth.RegisterRequest;
import com.felix.bms.dto.token.TokenRefreshRequest;
import com.felix.bms.dto.user.UserProfileResponse;
import com.felix.bms.entity.User;
import com.felix.bms.enums.Role;
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

import java.util.Locale;
import java.util.Optional;

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
    private final UserService userService;

    public AuthResponse register(RegisterRequest registerRequest) throws BadRequestException {

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
        user.setUsername(resolveUsername(registerRequest));

        userRepository.save(user);

        log.info("User registered: {}", user.getEmail());
        return buildAuthResponse(user);
    }

    public AuthResponse login(AuthRequest authRequest){

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.email(),authRequest.password()));

        User user=userRepository.findByEmail(authRequest.email()).orElseThrow(()->  new UsernameNotFoundException("User not found"));

        log.info("User logged in: {}", user.getEmail());
        return buildAuthResponse(user);

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

        return new AuthResponse(newAccessToken, newRefreshToken, userService.toPrivateProfile(user));

    }

    public Long getCurrentUserId(String email){
       return userRepository.findIdByEmail(email);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateToken(createUserDetails(user));
        String refreshToken = refreshTokenService.createRefreshToken(user.getEmail()).getToken();
        UserProfileResponse profile = userService.toPrivateProfile(user);
        return new AuthResponse(accessToken, refreshToken, profile);
    }

    private String resolveUsername(RegisterRequest registerRequest) throws BadRequestException {
        String requestedUsername = registerRequest.username();
        if (requestedUsername != null && !requestedUsername.isBlank()) {
            String normalizedUsername = normalizeUsername(requestedUsername);
            if (userRepository.existsByUsername(normalizedUsername)) {
                throw new BadRequestException("Username already in use");
            }
            return normalizedUsername;
        }
        return generateUniqueUsername(registerRequest.name(), registerRequest.email());
    }

    private String generateUniqueUsername(String name, String email) {
        String base = normalizeUsername(name);
        if (base.isBlank()) {
            String emailPrefix = email == null ? "" : email.split("@")[0];
            base = normalizeUsername(emailPrefix);
        }
        if (base.isBlank()) {
            base = "user";
        }

        String candidate = base;
        int suffix = 1;
        while (userRepository.existsByUsername(candidate)) {
            candidate = base + suffix;
            suffix++;
        }
        return candidate;
    }

    private String normalizeUsername(String value) {
        if (value == null) {
            return "";
        }
        return value
                .trim()
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "")
                .replaceAll("^_+|_+$", "");
    }

    public AuthResponse authenticateWithGoogle(GoogleOAuthRequest request) throws BadRequestException {
        // Note: In production, you should validate the idToken with Google's API
        // For now, we assume the frontend has validated it
        
        if (request.idToken() == null && request.accessToken() == null) {
            throw new BadRequestException("Either idToken or accessToken is required");
        }

        // In a production app, decode and verify the JWT token with Google's public keys
        // For this example, we'll use a simplified approach
        // You would use: com.google.auth.oauth2.GoogleIdTokenVerifier
        
        // Extract email from the request (frontend should provide this after Google verification)
        // This is a simplified implementation - in production validate the token properly
        
        User user = createOrUpdateGoogleUser(request);
        log.info("User authenticated via Google: {}", user.getEmail());
        return buildAuthResponse(user);
    }

    private User createOrUpdateGoogleUser(GoogleOAuthRequest request) {
        // In a real implementation, you would decode the idToken and extract:
        // - email, name, picture from the JWT payload
        // For now, this is a placeholder that needs the frontend to handle token verification
        
        // Extract email - this would come from decoded token in production
        String email = null;
        try {
            email = extractEmailFromToken(request.idToken() != null ? request.idToken() : request.accessToken());
        } catch (BadRequestException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            log.info("Google user already exists: {}", email);
            return user;
        }

        // Create new user from Google account
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setName(email.split("@")[0]); // Default to email prefix
        newUser.setUsername(generateUniqueUsername(email.split("@")[0], email));
        newUser.setPassword(""); // OAuth users don't have passwords
        newUser.setRole(Role.USER);
        
        userRepository.save(newUser);
        log.info("New user created via Google OAuth: {}", email);
        return newUser;
    }

    private String extractEmailFromToken(String token) throws BadRequestException  {
        // This is a simplified placeholder
        // In production, use Google's JWT verification library:
        // GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
        //     .setAudience(Collections.singletonList(YOUR_CLIENT_ID))
        //     .build();
        // GoogleIdToken idToken = verifier.verify(token);
        // return idToken.getPayload().getEmail();
        
        // For now, throw error if token is not properly formatted
        if (token == null || token.isEmpty()) {
            throw new BadRequestException("Invalid token");
        }
        
        // This is UNSAFE - for demonstration only
        // Real implementation should verify with Google
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                throw new BadRequestException("Invalid JWT token format");
            }
            // In production, properly decode and verify the JWT
            // This is just a placeholder
            throw new BadRequestException("Token verification requires Google Auth Library setup");
        } catch (Exception e) {
            throw new BadRequestException("Failed to extract email from token: " + e.getMessage());
        }
    }
}
