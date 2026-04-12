package com.felix.bms.dto.auth;

public record GoogleOAuthRequest(
        String idToken,
        String accessToken,
        String code
) {
}
