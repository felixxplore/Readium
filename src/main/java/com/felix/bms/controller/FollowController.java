package com.felix.bms.controller;

import com.felix.bms.service.AuthService;
import com.felix.bms.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

// controller/FollowController.java
@RestController
@RequestMapping("/api/follow")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;
    private final AuthService authService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{userId}")
    public ResponseEntity<Void> follow(@PathVariable Long userId, Authentication auth) {
        followService.followUser(authService.getCurrentUserId(auth.getName()), userId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> unfollow(@PathVariable Long userId, Authentication auth) {
        followService.unfollowUser(authService.getCurrentUserId(auth.getName()) , userId);
        return ResponseEntity.ok().build();
    }
}
