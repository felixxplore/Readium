package com.felix.bms.controller;

import com.felix.bms.dto.post.SavedPostResponse;
import com.felix.bms.exception.ResourceNotFoundException;
import com.felix.bms.service.SavedPostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/saved-posts")
@RequiredArgsConstructor
@Slf4j
public class SavedPostController {

    private final SavedPostService savedPostService;

    /**
     * Save a post
     * POST /api/saved-posts/{postId}
     */
    @PostMapping("/{postId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SavedPostResponse> savePost(
            @PathVariable Long postId,
            Authentication authentication) throws ResourceNotFoundException {
        String email = authentication.getName();
        log.info("User {} is saving post {}", email, postId);
        SavedPostResponse response = savedPostService.savePost(email, postId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Unsave a post
     * DELETE /api/saved-posts/{postId}
     */
    @DeleteMapping("/{postId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> unsavePost(
            @PathVariable Long postId,
            Authentication authentication) throws ResourceNotFoundException {
        String username = authentication.getName();
        log.info("User {} is unsaving post {}", username, postId);
        savedPostService.unsavePost(username, postId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all saved posts of the current user
     * GET /api/saved-posts?page=0&size=10
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<SavedPostResponse>> getSavedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) throws ResourceNotFoundException {
        String username = authentication.getName();
        Pageable pageable = PageRequest.of(page, size);
        log.info("Retrieving saved posts for user {} (page: {}, size: {})", username, page, size);
        Page<SavedPostResponse> response = savedPostService.getSavedPosts(username, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get saved posts of a specific user (public - viewable by anyone)
     * GET /api/saved-posts/user/{username}?page=0&size=10
     */
    @GetMapping("/user/{username}")
    public ResponseEntity<Page<SavedPostResponse>> getUserSavedPosts(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) throws ResourceNotFoundException {
        Pageable pageable = PageRequest.of(page, size);
        log.info("Retrieving saved posts for user {} (page: {}, size: {})", username, page, size);
        Page<SavedPostResponse> response = savedPostService.getSavedPosts(username, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Check if a post is saved by the current user
     * GET /api/saved-posts/{postId}/is-saved
     */
    @GetMapping("/{postId}/is-saved")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> isPostSaved(
            @PathVariable Long postId,
            Authentication authentication) throws ResourceNotFoundException {
        String username = authentication.getName();
        log.info("Checking if post {} is saved by user {}", postId, username);
        boolean isSaved = savedPostService.isPostSaved(username, postId);
        return ResponseEntity.ok(isSaved);
    }

    /**
     * Get count of saved posts by the current user
     * GET /api/saved-posts/count
     */
    @GetMapping("/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Long> getSavedPostsCount(
            Authentication authentication) throws ResourceNotFoundException {
        String username = authentication.getName();
        log.info("Getting saved posts count for user {}", username);
        long count = savedPostService.getSavedPostsCount(username);
        return ResponseEntity.ok(count);
    }

    /**
     * Get count of saves for a specific post
     * GET /api/saved-posts/{postId}/save-count
     */
    @GetMapping("/{postId}/save-count")
    public ResponseEntity<Long> getPostSaveCount(
            @PathVariable Long postId) throws ResourceNotFoundException {
        log.info("Getting save count for post {}", postId);
        long count = savedPostService.getPostSaveCount(postId);
        return ResponseEntity.ok(count);
    }
}
