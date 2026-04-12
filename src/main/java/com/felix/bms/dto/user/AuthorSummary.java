package com.felix.bms.dto.user;

public record AuthorSummary(
        Long id,
        String name,
        String username,
        String avatar,
        String bio
) {
}
