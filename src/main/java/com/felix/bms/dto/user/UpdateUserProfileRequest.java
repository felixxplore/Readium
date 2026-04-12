package com.felix.bms.dto.user;

public record UpdateUserProfileRequest(
        String name,
        String bio,
        String avatar
) {
}
