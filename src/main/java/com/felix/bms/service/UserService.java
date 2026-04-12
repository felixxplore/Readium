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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

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

}
