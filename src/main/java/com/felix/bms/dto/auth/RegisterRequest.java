package com.felix.bms.dto.auth;

public record RegisterRequest(String name, String email, String password, String username) {
}
