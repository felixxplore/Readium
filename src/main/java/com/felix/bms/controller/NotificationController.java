package com.felix.bms.controller;

import com.felix.bms.dto.notification.NotificationResponse;
import com.felix.bms.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<Page<NotificationResponse>> getNotifications(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(notificationService.getNotifications(auth.getName(), page, size));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/unread")
    public ResponseEntity<Page<NotificationResponse>> getUnreadNotifications(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(auth.getName(), page, size));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(Authentication auth) {
        return ResponseEntity.ok(notificationService.getUnreadCount(auth.getName()));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<String> markAsRead(
            @PathVariable Long notificationId,
            Authentication auth) {
        notificationService.markAsRead(notificationId, auth.getName());
        return ResponseEntity.ok("Notification marked as read");
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/read-all")
    public ResponseEntity<String> markAllAsRead(Authentication auth) {
        notificationService.markAllAsRead(auth.getName());
        return ResponseEntity.ok("All notifications marked as read");
    }
}
