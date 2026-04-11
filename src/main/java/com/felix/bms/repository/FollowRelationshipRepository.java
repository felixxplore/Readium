package com.felix.bms.repository;

import com.felix.bms.entity.FollowRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FollowRelationshipRepository extends JpaRepository<FollowRelationship, Long> {
    Optional<FollowRelationship> findByFollowerIdAndFollowingId(Long followerId, Long followingId);
    long countByFollowingId(Long userId);  // Following count
    long countByFollowerId(Long userId);   // Followers count
}
