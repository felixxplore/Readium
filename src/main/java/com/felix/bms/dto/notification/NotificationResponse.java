package com.felix.bms.dto.notification;

import com.felix.bms.enums.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String actorName,
        String actorUsername,
        String actorAvatar,
        NotificationType type,
        String message,
        Long postId,
        Long commentId,
        boolean isRead,
        LocalDateTime createdAt
) {
}
