package com.felix.bms.repository;

import com.felix.bms.entity.Comment;
import com.felix.bms.entity.Like;
import com.felix.bms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

     Optional<Like> findByPost_IdAndUser_Email(Long postId, String email);

    Optional<Like> findByComment_IdAndUser_Email(Long commentId, String email);


    boolean existsByUserAndComment(User user, Comment comment);
}
