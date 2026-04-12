package com.felix.bms.controller;

import com.felix.bms.dto.comment.CommentResponse;
import com.felix.bms.dto.comment.CreateCommentRequest;
import com.felix.bms.dto.post.BlogPostResponse;
import com.felix.bms.dto.post.CreatePostRequest;
import com.felix.bms.dto.post.UpdatePostRequest;
import com.felix.bms.service.BlogPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.AccessDeniedException;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class BlogPostController {

    private final BlogPostService blogPostService;

    // Public: List all posts
    @GetMapping
    public ResponseEntity<Page<BlogPostResponse>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogPostService.getAllPosts(page, size));
    }
    
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/my")
    public ResponseEntity<Page<BlogPostResponse>> getMyPosts(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){
        return ResponseEntity.ok(blogPostService.getAllPostsByUserEmail(auth.getName(), page, size));
    }

    @GetMapping("/author/{username}")
    public ResponseEntity<Page<BlogPostResponse>> getPostsByAuthor(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogPostService.getPostsByAuthorUsername(username, page, size));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<BlogPostResponse>> searchPosts(
            @RequestParam("q") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogPostService.searchPosts(query, page, size));
    }

    // Public: Get single post with comments
    @GetMapping("/{id}")
    public ResponseEntity<BlogPostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(blogPostService.getPostById(id));
    }

    // Authenticated: Create post
    @PreAuthorize("isAuthenticated()")
    @PostMapping
     public ResponseEntity<BlogPostResponse> createPost(
            @Valid @RequestBody CreatePostRequest request,
            Authentication auth) {
        BlogPostResponse post = blogPostService.createPost(request, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    // Authenticated: Update own post
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
     public ResponseEntity<BlogPostResponse> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequest request,
            Authentication auth) throws AccessDeniedException {
        BlogPostResponse post = blogPostService.updatePost(id, request, auth.getName());
        return ResponseEntity.ok(post);
    }

    // Authenticated: Delete post (owner + admin)
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id, Authentication auth) throws AccessDeniedException {
        blogPostService.deletePost(id, auth.getName());
        return ResponseEntity.ok("Delete post successfully");
    }

    @GetMapping("/{id}/comment")
    public ResponseEntity<Page<CommentResponse>> getAllCommentsOfPost(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size){
        return ResponseEntity.ok(blogPostService.getAllCommentsOfPost(id, page, size));
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/comment")
    public ResponseEntity<CommentResponse> addCommentToPost(@PathVariable  Long id, @Valid @RequestBody CreateCommentRequest createCommentRequest, Authentication auth){
       return ResponseEntity.ok(blogPostService.addComment(id, createCommentRequest, auth.getName()));
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/comment/{commentId}/reply")
    public ResponseEntity<CommentResponse> addReply(@PathVariable Long commentId, @RequestBody CreateCommentRequest request, Authentication auth) {
        CommentResponse reply = blogPostService.addReply(commentId, request, auth.getName());
        return ResponseEntity.ok(reply);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{postId}/comment/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable Long postId, @PathVariable Long commentId, @Valid @RequestBody CreateCommentRequest request, Authentication auth) throws AccessDeniedException {

        return ResponseEntity.ok(blogPostService.updateComment(commentId, request, auth.getName()));
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{postId}/comment/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Long postId, @PathVariable Long commentId, Authentication auth) throws AccessDeniedException {
        blogPostService.deleteComment(commentId, auth.getName());

        return ResponseEntity.ok("Delete comment successfully Id : " + commentId);
    }

}
