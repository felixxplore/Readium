package com.felix.bms.service;

import com.felix.bms.entity.BlogPost;
import com.felix.bms.entity.SavedPost;
import com.felix.bms.entity.User;
import com.felix.bms.dto.post.SavedPostResponse;
import com.felix.bms.exception.ResourceNotFoundException;
import com.felix.bms.repository.SavedPostRepository;
import com.felix.bms.repository.BlogPostRepository;
import com.felix.bms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SavedPostService {

    private final SavedPostRepository savedPostRepository;
    private final BlogPostRepository blogPostRepository;
    private final UserRepository userRepository;

    /**
     * Save a post for the current user
     */
    public SavedPostResponse savePost(String email, Long postId) throws ResourceNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        // Check if already saved
        if (savedPostRepository.existsByUserAndPost(user, post)) {
            log.warn("Post {} already saved by user {}", postId, email);
            throw new ResourceNotFoundException("Post already saved");
        }

        SavedPost savedPost = new SavedPost(user, post);
        SavedPost saved = savedPostRepository.save(savedPost);
        log.info("Post {} saved by user {}", postId, email);

        return SavedPostResponse.fromEntity(saved);
    }

    /**
     * Unsave a post for the current user
     */
    public void unsavePost(String username, Long postId) throws ResourceNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        SavedPost savedPost = savedPostRepository.findByUserAndPost(user, post)
                .orElseThrow(() -> new ResourceNotFoundException("Post not in saved list"));

        savedPostRepository.deleteByUserAndPost(user, post);
        log.info("Post {} unsaved by user {}", postId, username);
    }

    /**
     * Get all saved posts of a specific user with pagination
     */
    public Page<SavedPostResponse> getSavedPosts(String username, Pageable pageable) throws ResourceNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Page<SavedPost> savedPosts = savedPostRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        log.info("Retrieved {} saved posts for user {}", savedPosts.getTotalElements(), username);

        return savedPosts.map(SavedPostResponse::fromEntity);
    }

    /**
     * Check if a post is saved by a specific user
     */
    public boolean isPostSaved(String username, Long postId) throws ResourceNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        return savedPostRepository.existsByUserAndPost(user, post);
    }

    /**
     * Get total count of saved posts by a user
     */
    public long getSavedPostsCount(String username) throws ResourceNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return savedPostRepository.countByUser(user);
    }

    /**
     * Get total count of saves for a specific post
     */
    public long getPostSaveCount(Long postId) throws ResourceNotFoundException {
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        return savedPostRepository.countByPost(post);
    }
}
