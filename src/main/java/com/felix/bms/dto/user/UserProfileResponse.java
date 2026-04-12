package com.felix.bms.dto.user;

public record UserProfileResponse(
        Long id,
        String name,
        String username,
        String email,
        String avatar,
        String bio,
        long followerCount,
        long followingCount
) {
}
