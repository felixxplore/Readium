package com.felix.bms.repository;

import com.felix.bms.entity.BlogPost;
import com.felix.bms.entity.SavedPost;
import com.felix.bms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedPostRepository extends JpaRepository<SavedPost, Long> {

    /**
     * Check if a user has already saved a post
     */
    boolean existsByUserAndPost(User user, BlogPost post);

    /**
     * Find a saved post by user and post
     */
    Optional<SavedPost> findByUserAndPost(User user, BlogPost post);

    /**
     * Get all saved posts for a specific user with pagination
     */
    Page<SavedPost> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    /**
     * Count total saved posts by a user
     */
    long countByUser(User user);

    /**
     * Check if a post is saved by any user
     */
    long countByPost(BlogPost post);

    /**
     * Delete saved post by user and post
     */
    void deleteByUserAndPost(User user, BlogPost post);
}
