package com.felix.bms.service;

import com.felix.bms.entity.FollowRelationship;
import com.felix.bms.repository.FollowRelationshipRepository;
import com.felix.bms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class FollowService {


    private final FollowRelationshipRepository followRepository;

    private final UserRepository userRepository;

    public void followUser(Long followerId, Long followingId) {
        if (followRepository.findByFollowerIdAndFollowingId(followerId, followingId).isEmpty()) {
            FollowRelationship rel = new FollowRelationship();
            rel.setFollower(userRepository.findById(followerId).orElseThrow(()-> new UsernameNotFoundException("Follower user not found with this id : "+ followerId)));
            rel.setFollowing(userRepository.findById(followingId).orElseThrow(()-> new UsernameNotFoundException("Following user not found with this id : "+ followingId)));
            followRepository.save(rel);
        }
    }

    public void unfollowUser(Long followerId, Long followingId) {
        followRepository.findByFollowerIdAndFollowingId(followerId, followingId)
                .ifPresent(followRepository::delete);
    }

    public long getFollowersCount(Long userId) {
        return followRepository.countByFollowerId(userId);
    }


}
