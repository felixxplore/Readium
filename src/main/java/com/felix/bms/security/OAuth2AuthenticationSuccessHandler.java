package com.felix.bms.security;

import com.felix.bms.dto.user.UserProfileResponse;
import com.felix.bms.entity.User;
import com.felix.bms.enums.AuthProvider;
import com.felix.bms.repository.FollowRelationshipRepository;
import com.felix.bms.repository.UserRepository;
import com.felix.bms.service.CustomUserDetails;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final FollowRelationshipRepository followRelationshipRepository;

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
                String baseUsername = email.split("@")[0];
                String username = baseUsername;
                int count = 1;

                while (userRepository.existsByUsername(username)) {
                    username = baseUsername + count++;
                }

                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setUsername(username);
                user.setProvider(AuthProvider.GOOGLE);
                user.setProviderId(providerId);

                user = userRepository.save(user);
            }

            // Generate JWT tokens
            CustomUserDetails userDetails = new CustomUserDetails(user);
            String accessToken = jwtService.generateToken(userDetails); // 0 means use default expiry
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
            Cookie accessCookie = new Cookie("accessToken", accessToken);
            accessCookie.setHttpOnly(true);
            accessCookie.setPath("/");

            Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
            refreshCookie.setHttpOnly(true);
            refreshCookie.setPath("/");

            Cookie profileCookie = new Cookie("profile",  profileResponse.toString());

            response.addCookie(accessCookie);
            response.addCookie(refreshCookie);
            response.addCookie(profileCookie);

            // Redirect
            response.sendRedirect("http://localhost:3000");
            log.info("OAuth2 authentication successful for user: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Error in OAuth2 success handler: {}", e);
            SecurityContextHolder.clearContext();
            response.sendRedirect("http://localhost:3000/login?error=oauth_failed");
        }
    }
}
