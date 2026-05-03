package com.felix.bms.service;

import com.felix.bms.dto.user.UpdateUserProfileRequest;
import com.felix.bms.dto.user.UserProfileResponse;
import com.felix.bms.entity.User;
import com.felix.bms.exception.ResourceNotFoundException;
import com.felix.bms.repository.FollowRelationshipRepository;
import com.felix.bms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FollowRelationshipRepository followRelationshipRepository;

    public UserProfileResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return toPrivateProfile(user);
    }

    @Cacheable(value = "userProfile", key = "#username")
    public UserProfileResponse getPublicProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username : " + username));
        return toPublicProfile(user);
    }

    public UserProfileResponse toPrivateProfile(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getPicture(),
                user.getBio(),
                followRelationshipRepository.countByFollowingId(user.getId()),
                followRelationshipRepository.countByFollowerId(user.getId())
        );
    }

    public UserProfileResponse toPublicProfile(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getUsername(),
                null,
                user.getPicture(),
                user.getBio(),
                followRelationshipRepository.countByFollowingId(user.getId()),
                followRelationshipRepository.countByFollowerId(user.getId())
        );
    }

    @CacheEvict(value = "userProfile", key = "#email")
    public UserProfileResponse updateUserProfile(String email, UpdateUserProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name());
        }
        if (request.bio() != null) {
            user.setBio(request.bio());
        }
        if (request.avatar() != null && !request.avatar().isBlank()) {
            user.setPicture(request.avatar());
        }

        userRepository.save(user);
        return toPrivateProfile(user);
    }

    public List<String> generateUsernameSuggestions(String name) {

        String base = normalizeUsername(name);

        if (base.isBlank()) {
            base = "user";
        }

        List<String> suggestions = new ArrayList<>();

        // Basic variations
        suggestions.add(base);
        suggestions.add(base + "_");
        suggestions.add(base + "123");

        // Random suffixes
        for (int i = 0; i < 5; i++) {
            suggestions.add(base + randomNumber());
        }

        // 🔥 Filter only available usernames
        return suggestions.stream()
                .map(this::normalizeUsername)
                .filter(u -> !userRepository.existsByUsername(u))
                .distinct()
                .limit(5)
                .toList();
    }

    private String randomNumber() {
        return String.valueOf(ThreadLocalRandom.current().nextInt(100, 999));
    }

    public boolean isUsernameAvailable(String username) {

        String normalized = normalizeUsername(username);

        if (normalized.length() < 3) {
            return false;
        }

        return !userRepository.existsByUsernameIgnoreCase(normalized);
    }

    private String normalizeUsername(String value) {
        return value == null ? "" :
                value.trim()
                        .toLowerCase()
                        .replaceAll("[^a-z0-9_]", "_")   // replace, don’t remove
                        .replaceAll("_+", "_")           // collapse multiple _
                        .replaceAll("^_|_$", "");        // trim edges
    }

    public void setUsername(String username, Authentication auth) {

        String normalized = normalizeUsername(username);

        if (!isUsernameAvailable(normalized)) {
            throw new RuntimeException("Username not available");
        }

        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        if (user.getUsername() != null) {
            throw new RuntimeException("Username already set");
        }

        user.setUsername(normalized);

        try {
            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Username already taken");
        }
    }
}
