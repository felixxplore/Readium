package com.felix.bms.dto.auth;

import com.felix.bms.dto.user.UserProfileResponse;

public record AuthResponse(String accessToken, String refreshToken, UserProfileResponse user) {}
