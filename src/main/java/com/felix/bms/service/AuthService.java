package com.felix.bms.service;

import com.felix.bms.dto.auth.AuthRequest;
import com.felix.bms.dto.auth.AuthResponse;
import com.felix.bms.dto.auth.GoogleOAuthRequest;
import com.felix.bms.dto.auth.RegisterRequest;
import com.felix.bms.dto.token.TokenRefreshRequest;
import com.felix.bms.dto.user.UserProfileResponse;
import com.felix.bms.entity.EmailVerificationToken;
import com.felix.bms.entity.RefreshToken;
import com.felix.bms.entity.User;
import com.felix.bms.enums.AuthProvider;
import com.felix.bms.enums.Role;
import com.felix.bms.exception.InvalidRefreshTokenException;
import com.felix.bms.exception.UserAlreadyExistsException;
import com.felix.bms.repository.EmailVerificationTokenRepository;
import com.felix.bms.repository.FollowRelationshipRepository;
import com.felix.bms.repository.RefreshTokenRepository;
import com.felix.bms.repository.UserRepository;
import com.felix.bms.security.JwtService;
import com.felix.bms.util.CookieUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    // register or signup api
    // login api
    // refreshToken api


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UserService userService;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final EmailService emailService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final FollowRelationshipRepository followRelationshipRepository;

    @Value("${google.client-id}")
    private String googleClientId;




    @Transactional
    public void register(RegisterRequest registerRequest)   {

        String email = registerRequest.email().trim().toLowerCase();

        if(userRepository.existsByEmail( email )){
            throw new UserAlreadyExistsException("Email is already registered");
        }

        User user=new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(registerRequest.password()));
        user.setName(registerRequest.name());


        User savedUser= userRepository.save(user);

        // create token : generate token
        String token = UUID.randomUUID().toString();

        EmailVerificationToken verificationToken = new EmailVerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(savedUser);
        verificationToken.setExpiryDate(Instant.now().plus(15, ChronoUnit.MINUTES));

        emailVerificationTokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(user.getEmail(), token);

    }

    public Map<String, Boolean> login(AuthRequest authRequest, HttpServletResponse response){

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.email(),authRequest.password()));

        User user=userRepository.findByEmail(authRequest.email()).orElseThrow(()->  new UsernameNotFoundException("User not found"));

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Email not verified");
        }

        String access = jwtService.generateToken(user.getEmail(),user.getRole().toString());
//        String refresh = jwtService.generateRefreshToken(user.getEmail());

        RefreshToken refreshToken = createRefreshToken(user);
        String refresh = refreshToken.getToken();

        ResponseCookie accessCookie = new CookieUtil().createAccessTokenCookie(access);
        ResponseCookie refreshCookie = new CookieUtil().createRefreshTokenCookie(refresh);

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return Map.of("hasUsername", user.getUsername() != null);

    }

    public UserDetails createUserDetails(User user){
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_"+ user.getRole().name())
                .build();
    }

    public AuthResponse refreshToken(HttpServletRequest request, HttpServletResponse response){
//        String refreshTokenValue = extractCookie(request, "refreshToken");

        String refreshTokenValue=extractBearerToken(request);

        if (refreshTokenValue == null) {
            throw new RuntimeException("Refresh token missing");
        }

        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (storedToken.isRevoked()) {
            throw new RuntimeException("Token revoked");
        }

        if (storedToken.getExpiredDate().isBefore(Instant.now())) {
            throw new RuntimeException("Refresh token expired");
        }

        User user = storedToken.getUser();

        // 🔁 ROTATION (IMPORTANT)
        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        RefreshToken newRefreshToken = createRefreshToken(user);

        String newAccessToken = jwtService.generateToken(user.getEmail(),user.getRole().toString());

        return new AuthResponse(newAccessToken, newRefreshToken.getToken());
    }

    public Long getCurrentUserId(String email){
       return userRepository.findIdByEmail(email);
    }

//    private AuthResponse buildAuthResponse(User user) {
//        String accessToken = jwtService.generateToken(createUserDetails(user));
//        String refreshToken = refreshTokenService.createRefreshToken(user.getEmail()).getToken();
//        UserProfileResponse profile = userService.toPrivateProfile(user);
//        return new AuthResponse(accessToken, refreshToken, profile);
//    }

//    private String resolveUsername(RegisterRequest registerRequest) throws BadRequestException {
//        String requestedUsername = registerRequest.username();
//        if (requestedUsername != null && !requestedUsername.isBlank()) {
//            String normalizedUsername = normalizeUsername(requestedUsername);
//            if (userRepository.existsByUsername(normalizedUsername)) {
//                throw new BadRequestException("Username already in use");
//            }
//            return normalizedUsername;
//        }
//        return generateUniqueUsername(registerRequest.name(), registerRequest.email());
//    }

//    private String generateUniqueUsername(String name, String email) {
//        String base = normalizeUsername(name);
//        if (base.isBlank()) {
//            String emailPrefix = email == null ? "" : email.split("@")[0];
//            base = normalizeUsername(emailPrefix);
//        }
//        if (base.isBlank()) {
//            base = "user";
//        }
//
//        String candidate = base;
//        int suffix = 1;
//        while (userRepository.existsByUsername(candidate)) {
//            candidate = base + suffix;
//            suffix++;
//        }
//        return candidate;
//    }

//    private String normalizeUsername(String value) {
//        if (value == null) {
//            return "";
//        }
//        return value
//                .trim()
//                .toLowerCase(Locale.ROOT)
//                .replaceAll("[^a-z0-9]+", "")
//                .replaceAll("^_+|_+$", "");
//    }

//    public AuthResponse authenticateWithGoogle(GoogleOAuthRequest request) throws BadRequestException {
//        // Note: In production, you should validate the idToken with Google's API
//        // For now, we assume the frontend has validated it
//
//        if (request.idToken() == null && request.accessToken() == null) {
//            throw new BadRequestException("Either idToken or accessToken is required");
//        }
//
//        // In a production app, decode and verify the JWT token with Google's public keys
//        // For this example, we'll use a simplified approach
//        // You would use: com.google.auth.oauth2.GoogleIdTokenVerifier
//
//        // Extract email from the request (frontend should provide this after Google verification)
//        // This is a simplified implementation - in production validate the token properly
//
//        User user = createOrUpdateGoogleUser(request);
//        log.info("User authenticated via Google: {}", user.getEmail());
//        return buildAuthResponse(user);
//    }

//    private User createOrUpdateGoogleUser(GoogleOAuthRequest request) {
//        // In a real implementation, you would decode the idToken and extract:
//        // - email, name, picture from the JWT payload
//        // For now, this is a placeholder that needs the frontend to handle token verification
//
//        // Extract email - this would come from decoded token in production
//        String email = null;
//        try {
//            email = extractEmailFromToken(request.idToken() != null ? request.idToken() : request.accessToken());
//        } catch (BadRequestException e) {
//            // TODO Auto-generated catch block
//            e.printStackTrace();
//        }
//
//        Optional<User> existingUser = userRepository.findByEmail(email);
//
//        if (existingUser.isPresent()) {
//            User user = existingUser.get();
//            log.info("Google user already exists: {}", email);
//            return user;
//        }
//
//        // Create new user from Google account
//        User newUser = new User();
//        newUser.setEmail(email);
//        newUser.setName(email.split("@")[0]); // Default to email prefix
//        newUser.setUsername(generateUniqueUsername(email.split("@")[0], email));
//        newUser.setPassword(""); // OAuth users don't have passwords
//        newUser.setRole(Role.USER);
//
//        userRepository.save(newUser);
//        log.info("New user created via Google OAuth: {}", email);
//        return newUser;
//    }

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

    @Transactional
    public Map<String, Boolean>  verifyEmail(String token, HttpServletResponse response) {

        EmailVerificationToken t = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (t.getExpiryDate().isBefore(Instant.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = t.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        emailVerificationTokenRepository.deleteById(t.getId());

        String access = jwtService.generateToken(user.getEmail(),user.getRole().toString());
//        String refresh = jwtService.generateRefreshToken(user.getEmail());

        RefreshToken refreshToken = createRefreshToken(user);
        String refresh = refreshToken.getToken();

        ResponseCookie accessCookie = new CookieUtil().createAccessTokenCookie(access);
        ResponseCookie refreshCookie = new CookieUtil().createRefreshTokenCookie(refresh);

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return Map.of("hasUsername", user.getUsername() != null);
    }

    private RefreshToken createRefreshToken(User user) {

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setUser(user);
        refreshToken.setExpiredDate(Instant.now().plus(Duration.ofDays(7)));

        return refreshTokenRepository.save(refreshToken);
    }

    private String extractCookie(HttpServletRequest request, String name)  {
        if (request.getCookies() == null) return null;

        return Arrays.stream(request.getCookies())
                .filter(c -> c.getName().equals(name))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    public void resendVerification(String email) {

        Optional<User> optionalUser = userRepository.findByEmail(email.toLowerCase());

        // 🔒 Don't reveal if user exists
        if (optionalUser.isEmpty()) {
            return;
        }

        User user = optionalUser.get();

        // If already verified → do nothing
        if (user.isEmailVerified()) {
            return;
        }

        // 🔥 Delete old tokens (IMPORTANT)
        emailVerificationTokenRepository.deleteByUser(user);

        // Generate new token
        EmailVerificationToken token = new EmailVerificationToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setExpiryDate(Instant.now().plus(Duration.ofMinutes(15)));

        emailVerificationTokenRepository.save(token);

        emailService.sendVerificationEmail(user.getEmail(), token.getToken());
    }

    public AuthResponse authenticateWithGoogle(GoogleOAuthRequest request) throws BadRequestException {

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId)) // apne Client ID se match
                .build();

        GoogleIdToken idToken;
        try {
            idToken = verifier.verify(request.idToken());
        } catch (Exception e) {
            throw new BadRequestException("Invalid Google token");
        }

        if (idToken == null) {
            throw new BadRequestException("Invalid or expired Google token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String pictureUrl = (String) payload.get("picture");
        boolean emailVerified = payload.getEmailVerified();

        // DB check - user exist karta hai kya
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName(name);
                    newUser.setPicture(pictureUrl);
                    newUser.setProvider(AuthProvider.GOOGLE);
                    newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // password ki zarurat nahi
                    return userRepository.save(newUser);
                });

        // apna JWT generate karo (jo aap normal login me bhi use karte ho)
        String accessToken = jwtService.generateToken(user.getEmail(),user.getRole().toString());
        String newRefreshToken=jwtService.generateRefreshToken(user.getEmail());

        RefreshToken refreshToken=new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setExpiredDate(Instant.now().plus(7, ChronoUnit.DAYS));
        refreshToken.setRevoked(false);
        refreshToken.setToken(newRefreshToken);

        RefreshToken refreshToken1=refreshTokenRepository.save(refreshToken);

        long followerCount = followRelationshipRepository.countByFollowerId(user.getId());
        long followingCount = followRelationshipRepository.countByFollowingId(user.getId());

        return new AuthResponse(accessToken, refreshToken1.getToken(),  UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatar(user.getPicture())
                .bio(user.getBio())
                .followerCount(followerCount)
                .followingCount(followingCount)
                .build() );
    }

    private String extractBearerToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
