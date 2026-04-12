package com.felix.bms.controller;


import com.felix.bms.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/post/{id}")
    public ResponseEntity<Void> likePost(@PathVariable Long id, Authentication auth) {
        likeService.likePost(id, auth.getName());
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/comment/{id}")
    public ResponseEntity<Void> likeComment(@PathVariable Long id, Authentication auth) {
        likeService.likeComment(id, auth.getName());
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/post/{id}/unlike")
    public ResponseEntity<Void> unlikePost(@PathVariable Long id, Authentication auth) {
        likeService.unlikePost(id, auth.getName());
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/comment/{id}/unlike")
    public ResponseEntity<Void> unlikeComment(@PathVariable Long id, Authentication auth) {
        likeService.unlikeComment(id, auth.getName());
        return ResponseEntity.ok().build();
    }
}
