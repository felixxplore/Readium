package com.felix.bms.service;


import com.felix.bms.entity.*;
import com.felix.bms.enums.LikeType;
import com.felix.bms.exception.ResourceNotFoundException;
import com.felix.bms.repository.BlogPostRepository;
import com.felix.bms.repository.CommentRepository;
import com.felix.bms.repository.LikeRepository;
import com.felix.bms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class LikeService {

    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final BlogPostRepository blogPostRepository;
    private final CommentRepository commentRepository;
    private final EmailService emailService;

    @Transactional
    public void likePost(Long postId, String email) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("user not found with this email : " + email));

        BlogPost post = blogPostRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("post not found with this id : " + postId));

        Like like=new Like();
        like.setUser(user);
        like.setPost(post);

        Like save = likeRepository.save(like);

        emailService.sendLikedNotification(post.getAuthor().getEmail(), user.getName(), LikeType.POST);
    }

    @Transactional
    public void unlikePost(Long postId, String email) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("user not found with this email : " + email));

        BlogPost post = blogPostRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("post not found with this id : " + postId));



        Like like = likeRepository.findByPost_IdAndUser_Email(postId,  email).orElseThrow(()-> new ResourceNotFoundException(email+" not liked on this "+post.getTitle()+ post));

        likeRepository.deleteById(like.getId());
    }

    @Transactional
    public void likeComment(Long commentId, String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("user not found with this email : " + email));

        Comment comment = commentRepository.findById(commentId).orElseThrow(()-> new ResourceNotFoundException("comment not found with this id : "+commentId));

        if (!likeRepository.existsByUserAndComment(user, comment)) {
            Like like = new Like();
            like.setUser(user);
            like.setComment(comment);
            likeRepository.save(like);
        }

        emailService.sendLikedNotification(comment.getAuthor().getEmail(), user.getName(), LikeType.COMMENT);
    }

    @Transactional
    public void unlikeComment(Long commentId, String email) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("user not found with this email : " + email));

         Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new ResourceNotFoundException("post not found with this id : " + commentId));



        Like like = likeRepository.findByComment_IdAndUser_Email( commentId,  email).orElseThrow(()-> new ResourceNotFoundException(email+" not liked on this comment id : " + commentId));

        likeRepository.deleteById(like.getId());
    }
}
