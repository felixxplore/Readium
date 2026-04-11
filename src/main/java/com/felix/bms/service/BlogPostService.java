package com.felix.bms.service;

import com.felix.bms.dto.comment.CommentResponse;
import com.felix.bms.dto.comment.CreateCommentRequest;
import com.felix.bms.dto.post.BlogPostResponse;
import com.felix.bms.dto.post.CreatePostRequest;
import com.felix.bms.dto.post.UpdatePostRequest;
import com.felix.bms.entity.BlogPost;
import com.felix.bms.entity.Comment;
import com.felix.bms.entity.User;
import com.felix.bms.enums.Role;
import com.felix.bms.exception.ResourceNotFoundException;
import com.felix.bms.mapper.CommentMapper;
import com.felix.bms.repository.BlogPostRepository;
import com.felix.bms.repository.CommentRepository;
import com.felix.bms.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly=true)
public class BlogPostService {
    
    private final BlogPostRepository blogPostRepository;
    private final CommentMapper commentMapper;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final CommentRepository commentRepository;

    public List<BlogPostResponse> getAllPosts() {
        return blogPostRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public BlogPostResponse toResponse(BlogPost blogPost){

        List<CommentResponse> comments = blogPost.getComments().stream().map(commentMapper::toResponse).toList();

        return new BlogPostResponse(
                blogPost.getId(),
                blogPost.getTitle(),
                blogPost.getContent(),
                blogPost.getAuthor().getName(),
                blogPost.getCreatedAt(),
                comments
        );
    }


    public BlogPostResponse getPostById(Long id) {
        BlogPost blog = blogPostRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("blog not found"));

        return toResponse(blog);
    }

    public List<BlogPostResponse> getAllPostsByUserEmail(String email){

       return blogPostRepository.findByAuthor_Email(email).stream().map(this::toResponse).toList();
    }


    @Transactional
    public BlogPostResponse createPost(@Valid CreatePostRequest request, String authorEmail) {

        User user = getUserByEmail(authorEmail);
        BlogPost post=new BlogPost();
        post.setAuthor(user);
        post.setTitle(request.title());
        post.setContent(request.content());

        post = blogPostRepository.save(post);

        return toResponse(post);

    }


    public User getUserByEmail(String email){
        return userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
    }

    @Transactional
    public BlogPostResponse updatePost(Long id, @Valid UpdatePostRequest request, String email) throws AccessDeniedException {
        BlogPost post = blogPostRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post not found with this id : " + id));

        if(!post.getAuthor().getEmail().equals(email)){
            throw new AccessDeniedException("You can only update your own posts");
        }

        post.setTitle(request.title());
        post.setContent(request.content());
        post=blogPostRepository.save(post);
        return toResponse(post);
    }


    @Transactional
    public void deletePost(Long id, String email) throws AccessDeniedException {
        BlogPost post = blogPostRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post not found with this id : " + id));

        User user = getUserByEmail(email);
        if(user.getRole() != Role.ADMIN){
            throw new AccessDeniedException("Only Admin can delete posts");
        }

        blogPostRepository.delete(post);
    }


    @Transactional
    public CommentResponse addComment(Long postId, CreateCommentRequest request, String commentEmail){
        BlogPost post = blogPostRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("post not found with this id : " + postId));

        User user = getUserByEmail(commentEmail);

        Comment comment=new Comment();
        comment.setAuthor(user);
        comment.setPost(post);
        comment.setContent(request.content());

        post.getComments().add(comment);
        commentRepository.save(comment);
        blogPostRepository.save(post);

        // send email notification of comment to post author
//        if(!post.getAuthor().getEmail().equals(commentEmail)){
//            emailService.sendCommentNotification(post.getAuthor(), comment);
//        }


        return commentMapper.toResponse(comment);
    }

    @Transactional
    public CommentResponse addReply(Long parentCommentId,   CreateCommentRequest content, String email) {
        User author = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found with this email : "+email));
        Comment parent = commentRepository.findById(parentCommentId).orElseThrow(() -> new IllegalArgumentException("Parent comment not found with this id : "+parentCommentId));
        Comment reply = new Comment();
        reply.setContent(content.content());
        reply.setAuthor(author);
        reply.setPost(parent.getPost()); // Inherit post from parent
        reply.setParentComment(parent);
        Comment comment=commentRepository.save(reply);

//        emailService.sendCommentReplyNotification(parent.getAuthor().getEmail(),author.getName(), content.content());

        return commentMapper.toResponse(comment);
    }

    public List<CommentResponse> getAllCommentsOfPost(Long postId){
        BlogPost post = blogPostRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post not found with this id : " + postId));

        return post.getComments().stream().map(commentMapper::toResponse).toList();
    }


    @Transactional
    public CommentResponse updateComment(Long commentId, CreateCommentRequest request, String commentEmail) throws AccessDeniedException {

        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new ResourceNotFoundException("Comment not found with this id : " + commentId));

        if(!comment.getAuthor().getEmail().equals(commentEmail)){
            throw new AccessDeniedException("you can only update your own comments");
        }

        comment.setContent(request.content());
        comment=commentRepository.save(comment);

        return commentMapper.toResponse(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, String commentEmail) throws AccessDeniedException {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new ResourceNotFoundException("Comment not found with this id : " + commentId));

        if(!comment.getAuthor().getEmail().equals(commentEmail)){
            throw new AccessDeniedException("you can only delete your own comments");
        }

        commentRepository.delete(comment);
    }


}
