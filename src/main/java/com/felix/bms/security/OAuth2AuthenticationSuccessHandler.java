package com.felix.bms.security;

import com.felix.bms.entity.User;
import com.felix.bms.repository.UserRepository;
import com.felix.bms.service.CustomUserDetails;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        try {
            GoogleOAuth2User oAuth2User = (GoogleOAuth2User) authentication.getPrincipal();
            User user = oAuth2User.getUser();

            // Generate JWT tokens
            CustomUserDetails userDetails = new CustomUserDetails(user);
            String accessToken = jwtService.generateToken(userDetails); // 0 means use default expiry
            String refreshToken = jwtService.generateRefreshToken(user.getEmail());

            // Redirect to frontend with tokens
            String redirectUrl = String.format(
                    "http://localhost:3000/oauth2/callback?accessToken=%s&refreshToken=%s&username=%s",
                    accessToken,
                    refreshToken,
                    user.getUsername()
            );

            response.sendRedirect(redirectUrl);
            log.info("OAuth2 authentication successful for user: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Error in OAuth2 success handler: {}", e.getMessage());
            response.sendRedirect("http://localhost:3000/login?error=authentication_failed");
        }
    }
}
