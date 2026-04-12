package com.felix.bms.service;

import com.felix.bms.dto.comment.CommentResponse;
import com.felix.bms.dto.comment.CreateCommentRequest;
import com.felix.bms.dto.post.BlogPostResponse;
import com.felix.bms.dto.post.CreatePostRequest;
import com.felix.bms.dto.post.UpdatePostRequest;
import com.felix.bms.dto.user.AuthorSummary;
import com.felix.bms.entity.BlogPost;
import com.felix.bms.entity.Comment;
import com.felix.bms.entity.User;
import com.felix.bms.enums.Role;
import com.felix.bms.exception.ResourceNotFoundException;
import com.felix.bms.mapper.CommentMapper;
import com.felix.bms.repository.BlogPostRepository;
import com.felix.bms.repository.CommentRepository;
import com.felix.bms.repository.LikeRepository;
import com.felix.bms.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    private final LikeRepository likeRepository;
    private final NotificationService notificationService;

    public Page<BlogPostResponse> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return blogPostRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toResponse);
    }

    public BlogPostResponse toResponse(BlogPost blogPost){
        List<CommentResponse> comments = blogPost.getComments().stream()
                .filter(comment -> comment.getParentComment() == null)
                .map(commentMapper::toResponse)
                .toList();

        long likeCount = likeRepository.countByPost_Id(blogPost.getId());

        return new BlogPostResponse(
                blogPost.getId(),
                blogPost.getTitle(),
                blogPost.getSubtitle(),
                blogPost.getContent(),
                blogPost.getExcerpt(),
                blogPost.getCoverImage(),
                blogPost.getTags(),
                toAuthorSummary(blogPost.getAuthor()),
                blogPost.getCreatedAt(),
                blogPost.getUpdatedAt(),
                likeCount,
                comments
        );
    }


    @Cacheable(value = "blogPost", key = "#id")
    public BlogPostResponse getPostById(Long id) {
        BlogPost blog = blogPostRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("blog not found"));

        return toResponse(blog);
    }

    public Page<BlogPostResponse> getAllPostsByUserEmail(String email, int page, int size){
       Pageable pageable = PageRequest.of(page, size);
       return blogPostRepository.findByAuthor_EmailOrderByCreatedAtDesc(email, pageable).map(this::toResponse);
    }

    public Page<BlogPostResponse> getPostsByAuthorUsername(String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return blogPostRepository.findByAuthor_UsernameOrderByCreatedAtDesc(username, pageable)
                .map(this::toResponse);
    }

    public Page<BlogPostResponse> searchPosts(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return blogPostRepository
                .findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseOrderByCreatedAtDesc(query, query, pageable)
                .map(this::toResponse);
    }


    @Transactional
    public BlogPostResponse createPost(@Valid CreatePostRequest request, String authorEmail) {

        User user = getUserByEmail(authorEmail);
        BlogPost post=new BlogPost();
        post.setAuthor(user);
        post.setTitle(request.title());
        post.setSubtitle(request.subtitle());
        post.setExcerpt(resolveExcerpt(request.excerpt(), request.content()));
        post.setCoverImage(request.coverImage());
        post.setTags(request.tags() == null ? List.of() : request.tags());
        post.setContent(request.content());

        post = blogPostRepository.save(post);

        return toResponse(post);

    }


    public User getUserByEmail(String email){
        return userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
    }

    @Transactional
    @CacheEvict(value = "blogPost", key = "#id")
    public BlogPostResponse updatePost(Long id, @Valid UpdatePostRequest request, String email) throws AccessDeniedException {
        BlogPost post = blogPostRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post not found with this id : " + id));

        if(!post.getAuthor().getEmail().equals(email)){
            throw new AccessDeniedException("You can only update your own posts");
        }

        post.setTitle(request.title());
        post.setSubtitle(request.subtitle());
        post.setExcerpt(resolveExcerpt(request.excerpt(), request.content()));
        post.setCoverImage(request.coverImage());
        post.setTags(request.tags() == null ? List.of() : request.tags());
        post.setContent(request.content());
        post=blogPostRepository.save(post);
        return toResponse(post);
    }


    @Transactional
    @CacheEvict(value = "blogPost", key = "#id")
    public void deletePost(Long id, String email) throws AccessDeniedException {
        BlogPost post = blogPostRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post not found with this id : " + id));

        User user = getUserByEmail(email);
        boolean isAdmin = user.getRole() == Role.ADMIN;
        boolean isAuthor = post.getAuthor().getEmail().equals(email);
        if(!isAdmin && !isAuthor){
            throw new AccessDeniedException("You can only delete your own posts unless you are an admin");
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

        // Create notification for post author
        if(!post.getAuthor().getId().equals(user.getId())){
            notificationService.createCommentNotification(post.getAuthor(), user, post);
        }

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

        // Create notification for parent comment author
        if(!parent.getAuthor().getId().equals(author.getId())){
            notificationService.createReplyNotification(parent.getAuthor(), author, parent);
        }

        return commentMapper.toResponse(comment);
    }

    public Page<CommentResponse> getAllCommentsOfPost(Long postId, int page, int size){
        blogPostRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post not found with this id : " + postId));
        Pageable pageable = PageRequest.of(page, size);
        return commentRepository.findByPostIdAndParentCommentIsNullOrderByCreatedAtDesc(postId, pageable)
                .map(commentMapper::toResponse);
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


    private AuthorSummary toAuthorSummary(User author) {
        return new AuthorSummary(
                author.getId(),
                author.getName(),
                author.getUsername(),
                author.getPicture(),
                author.getBio()
        );
    }

    private String resolveExcerpt(String excerpt, String content) {
        if (excerpt != null && !excerpt.isBlank()) {
            return excerpt;
        }
        if (content == null || content.isBlank()) {
            return "";
        }
        int excerptLength = Math.min(content.length(), 180);
        return content.substring(0, excerptLength);
    }

}
