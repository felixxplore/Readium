package com.felix.bms.controller;

import com.felix.bms.dto.comment.CommentResponse;
import com.felix.bms.dto.comment.CreateCommentRequest;
import com.felix.bms.dto.post.BlogPostResponse;
import com.felix.bms.dto.post.CreatePostRequest;
import com.felix.bms.dto.post.UpdatePostRequest;
import com.felix.bms.entity.Comment;
import com.felix.bms.service.BlogPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class BlogPostController {

    private final BlogPostService blogPostService;

    // Public: List all posts
    @GetMapping
    public ResponseEntity<List<BlogPostResponse>> getAllPosts() {
        return ResponseEntity.ok(blogPostService.getAllPosts());
    }
    @GetMapping("/my")
    public ResponseEntity<List<BlogPostResponse>> getMyPosts(Authentication auth){
        return ResponseEntity.ok(blogPostService.getAllPostsByUserEmail(auth.getName()));
    }

    // Public: Get single post with comments
    @GetMapping("/{id}")
    public ResponseEntity<BlogPostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(blogPostService.getPostById(id));
    }

    // Authenticated: Create post
    @PostMapping
     public ResponseEntity<BlogPostResponse> createPost(
            @Valid @RequestBody CreatePostRequest request,
            Authentication auth) {
        BlogPostResponse post = blogPostService.createPost(request, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    // Authenticated: Update own post
    @PutMapping("/{id}")
     public ResponseEntity<BlogPostResponse> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequest request,
            Authentication auth) throws AccessDeniedException {
        BlogPostResponse post = blogPostService.updatePost(id, request, auth.getName());
        return ResponseEntity.ok(post);
    }

    // Admin only: Delete any post
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletePost(@PathVariable Long id, Authentication auth) throws AccessDeniedException {
        blogPostService.deletePost(id, auth.getName());
        return ResponseEntity.ok("Delete post successfully");
    }

    @GetMapping("/{id}/comment")
    public ResponseEntity<List<CommentResponse>> getAllCommentsOfPost(@PathVariable Long id){
        return ResponseEntity.ok(blogPostService.getAllCommentsOfPost(id));
    }

    @PostMapping("/{id}")
    public ResponseEntity<CommentResponse> addCommentToPost(@PathVariable  Long id, @Valid @RequestBody CreateCommentRequest createCommentRequest, Authentication auth){
       return ResponseEntity.ok(blogPostService.addComment(id, createCommentRequest, auth.getName()));
    }

    @PostMapping("/{commentId}/reply")
    public ResponseEntity<CommentResponse> addReply(@PathVariable Long commentId, @RequestBody CreateCommentRequest request, Authentication auth) {
        CommentResponse reply = blogPostService.addReply(commentId, request, auth.getName());
        return ResponseEntity.ok(reply);
    }

    @PutMapping("/{postId}/comment/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable Long postId, @PathVariable Long commentId, @Valid @RequestBody CreateCommentRequest request, Authentication auth) throws AccessDeniedException {

        return ResponseEntity.ok(blogPostService.updateComment(commentId, request, auth.getName()));
    }

    @DeleteMapping("/{postId}/comment/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Long postId, @PathVariable Long commentId, Authentication auth) throws AccessDeniedException {
        blogPostService.deleteComment(commentId, auth.getName());

        return ResponseEntity.ok("Delete comment successfully Id : " + commentId);
    }

}
