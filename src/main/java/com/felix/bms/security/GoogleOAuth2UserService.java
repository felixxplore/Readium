package com.felix.bms.security;

import com.felix.bms.dto.auth.AuthResponse;
import com.felix.bms.entity.User;
import com.felix.bms.enums.Role;
import com.felix.bms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        try {
            return processOAuth2User(oAuth2User);
        } catch (Exception e) {
            log.error("Error processing OAuth2 user: {}", e.getMessage());
            throw new OAuth2AuthenticationException(e.getMessage());
        }
    }

    public OAuth2User processOAuth2User(OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        // Find or create user
        Optional<User> userOpt = userRepository.findByEmail(email);

        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
            // Update picture if available
            if (picture != null) {
                user.setPicture(picture);
            }
            user = userRepository.save(user);
            log.info("User already exists, updated: {}", email);
        } else {
            user = new User();
            user.setEmail(email);
            user.setName(name != null ? name : "User");
            user.setUsername(generateUsername(email));
            user.setPicture(picture);
            user.setPassword(""); // OAuth users don't have password
            user.setRole(Role.USER);
            user = userRepository.save(user);
            log.info("New user created via OAuth2: {}", email);
        }

        // Return OAuth2User with user info
        return new GoogleOAuth2User(oAuth2User.getAttributes(), user);
    }

    private String generateUsername(String email) {
        // Convert email to username: user@example.com -> user_example
        String username = email.split("@")[0].replace(".", "_");
        
        // Check if username already exists, if yes append random numbers
        int counter = 1;
        String baseUsername = username;
        while (userRepository.findByUsername(username).isPresent()) {
            username = baseUsername + counter;
            counter++;
        }
        
        return username;
    }
}
