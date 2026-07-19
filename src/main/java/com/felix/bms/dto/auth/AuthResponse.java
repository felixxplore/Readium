package com.felix.bms.dto.auth;

import com.felix.bms.dto.user.UserProfileResponse;
import com.felix.bms.entity.RefreshToken;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserProfileResponse user
) {

    public AuthResponse(String accessToken, String refreshToken) {
        this(accessToken, refreshToken, null);
    }


}

