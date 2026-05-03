package com.felix.bms.security;

import com.felix.bms.dto.user.UserProfileResponse;
import com.felix.bms.entity.User;
import com.felix.bms.enums.AuthProvider;
import com.felix.bms.repository.FollowRelationshipRepository;
import com.felix.bms.repository.UserRepository;
import com.felix.bms.service.CustomUserDetails;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final FollowRelationshipRepository followRelationshipRepository;


    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        try {
            // GoogleOAuth2User oAuth2User = (GoogleOAuth2User)
            // authentication.getPrincipal();
            OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
            // User user = oAuth2User.getUser();

            String email = oidcUser.getEmail();
            String name = oidcUser.getFullName();
            String providerId = oidcUser.getSubject();
            Boolean emailVerified = oidcUser.getEmailVerified();

            if (email == null || Boolean.FALSE.equals(emailVerified)) {
                throw new RuntimeException("Email not verified by provider");
            }


            // String baseUsername = email.split("@")[0]; // felixxplore08

            // String username = baseUsername;
            // int count = 1;

            // while (userRepository.existsByUsername(username)) {
            // username = baseUsername + count++;
            // }

            // User user = userRepository.findByEmail(email)
            // .orElseGet(() -> {
            // User newUser = new User();
            // newUser.setEmail(email);
            // newUser.setName(name);
            // newUser.setUsername(username);
            // newUser.setProvider(AuthProvider.GOOGLE);
            // newUser.setProviderId(providerId);
            // return userRepository.save(newUser);
            // });

            Optional<User> optionalUser = userRepository.findByEmail(email);

            User user;

            if (optionalUser.isPresent()) {
                user = optionalUser.get();
            } else {
//                String baseUsername = email.split("@")[0];
//                String suffix = UUID.randomUUID().toString().substring(0, 6);
//                String username = baseUsername;
//                int count = 1;

//                while (userRepository.existsByUsername(username)) {
//                    username = baseUsername + count++;
//                }

                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setUsername(generateUsername(email));
                user.setProvider(AuthProvider.GOOGLE);
                user.setProviderId(providerId);

                user = userRepository.save(user);
            }

            // Generate JWT tokens
            CustomUserDetails userDetails = new CustomUserDetails(user);
            String accessToken = jwtService.generateToken(user.getEmail(),user.getRole().toString()); // 0 means use default expiry
            String refreshToken = jwtService.generateRefreshToken(user.getEmail());
             
            UserProfileResponse profileResponse = new UserProfileResponse();
            profileResponse.setEmail(user.getEmail());
            profileResponse.setName(user.getName());
            profileResponse.setUsername(user.getUsername());
            profileResponse.setAvatar(user.getPicture());
            profileResponse.setBio(user.getBio());
            profileResponse.setFollowerCount(followRelationshipRepository.countByFollowingId(user.getId()));
            profileResponse.setFollowingCount(followRelationshipRepository.countByFollowerId(user.getId()));
 

            // Store in cookies (recommended)
//            Cookie accessCookie = new Cookie("accessToken", accessToken);
//            accessCookie.setHttpOnly(true);
//            accessCookie.setPath("/");
//
//            Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
//            refreshCookie.setHttpOnly(true);
//            refreshCookie.setPath("/");
//
//            Cookie profileCookie = new Cookie("profile",  profileResponse.toString());
//
//            response.addCookie(accessCookie);
//            response.addCookie(refreshCookie);
//            response.addCookie(profileCookie);

            // Set secure cookies
            addSecureCookie(response, "accessToken", accessToken, 15 * 60); // 15 min
            addSecureCookie(response, "refreshToken", refreshToken, 7 * 24 * 60 * 60); // 7 days

            // Redirect (frontend will call /me API)
            response.sendRedirect(frontendUrl + "/oauth-success");
//            response.sendRedirect("http://localhost:3000");

            log.info("OAuth login success | userId={} | email={} | provider=GOOGLE",
                    user.getId(), user.getEmail());        }
        catch (Exception e) {
            log.error("Error in OAuth2 success handler: {}", e);
            SecurityContextHolder.clearContext();
//            response.sendRedirect("http://localhost:3000/login?error=oauth_failed");
            response.sendRedirect(frontendUrl + "/login?error=oauth_failed");
        }
    }


    private void addSecureCookie(HttpServletResponse response,
                                 String name,
                                 String value,
                                 int maxAgeSeconds) {

        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // ONLY HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(maxAgeSeconds);

        // SameSite fix (Servlet API workaround)
        response.addHeader("Set-Cookie",
                String.format("%s=%s; Max-Age=%d; Path=/; HttpOnly; Secure; SameSite=Strict",
                        name, value, maxAgeSeconds));
    }

    private String generateUsername(String email) {
        String base = email.split("@")[0];
        String suffix = UUID.randomUUID().toString().substring(0, 6);
        return base + "_" + suffix;
    }
}
