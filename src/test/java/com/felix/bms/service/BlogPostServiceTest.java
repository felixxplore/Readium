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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class BlogPostServiceTest {

    @Mock
    private BlogPostRepository blogPostRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CommentRepository commentRepository;
    @Mock
    private CommentMapper commentMapper;
    @Mock
    private EmailService emailService;

    @InjectMocks
    private BlogPostService blogPostService;


    private User user;
    private BlogPost post;
    private Comment comment;
    private User admin;
    private User commenter;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("john@example.com");
        user.setName("John Doe");
        user.setRole(Role.USER);

        admin = new User();
        admin.setId(2L);
        admin.setEmail("admin@example.com");
        admin.setName("Admin");
        admin.setRole(Role.ADMIN);

        post = new BlogPost();
        post.setId(1L);
        post.setTitle("Test Post");
        post.setContent("Test Content");
        post.setAuthor(user);
        post.setCreatedAt(LocalDateTime.now());
        post.setComments(new ArrayList<>());

        commenter = new User();
        commenter.setId(3L);
        commenter.setEmail("jane@example.com");
        commenter.setName("Jane Doe");
        commenter.setRole(Role.USER);

        comment = new Comment();
        comment.setId(1L);
        comment.setContent("Nice post!");
        comment.setAuthor(commenter);
        comment.setPost(post);
        comment.setCreatedAt(LocalDateTime.now());



//        when(commentMapper.toResponse(any(Comment.class)))
//                .thenReturn(new CommentResponse(1L, "Nice post!", "John Doe", LocalDateTime.now()));

    }

    @Test
    @DisplayName("Get All Posts - Success")
    void shouldGetAllPostsSuccessfully() {
        when(blogPostRepository.findAll()).thenReturn(List.of(post));

        List<BlogPostResponse> responses = blogPostService.getAllPosts();

        assertFalse(responses.isEmpty());
        assertEquals(1, responses.size());
        assertEquals("Test Post", responses.get(0).title());
        assertEquals("John Doe", responses.get(0).authorName());
        verify(blogPostRepository).findAll();
    }

    @Test
    @DisplayName("Get All Posts - Empty List")
    void shouldReturnEmptyListWhenNoPosts() {
        when(blogPostRepository.findAll()).thenReturn(List.of());

        List<BlogPostResponse> responses = blogPostService.getAllPosts();

        assertTrue(responses.isEmpty());
        verify(blogPostRepository).findAll();
    }

    @Test
    @DisplayName("Get Post by ID - Success")
    void shouldGetPostByIdSuccessfully() {
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(post));

        BlogPostResponse response = blogPostService.getPostById(1L);

        assertNotNull(response);
        assertEquals("Test Post", response.title());
        assertEquals("John Doe", response.authorName());
        verify(blogPostRepository).findById(1L);
    }

    @Test
    @DisplayName("Get Post by ID - Not Found")
    void shouldThrowWhenPostNotFound() {
        when(blogPostRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> blogPostService.getPostById(1L));
    }


    @Test
    @DisplayName("Get All Posts by User Email - Success")
    void shouldGetAllPostsByUserEmailSuccessfully() {
        when(blogPostRepository.findByAuthor_Email("john@example.com")).thenReturn(List.of(post));

        List<BlogPostResponse> responses = blogPostService.getAllPostsByUserEmail("john@example.com");

        assertFalse(responses.isEmpty());
        assertEquals("Test Post", responses.get(0).title());
        verify(blogPostRepository).findByAuthor_Email("john@example.com");
    }

    @Test
    @DisplayName("Get All Posts by User Email - No Posts")
    void shouldReturnEmptyListWhenNoPostsByUser() {
        when(blogPostRepository.findByAuthor_Email("john@example.com")).thenReturn(List.of());

        List<BlogPostResponse> responses = blogPostService.getAllPostsByUserEmail("john@example.com");

        assertTrue(responses.isEmpty());
        verify(blogPostRepository).findByAuthor_Email("john@example.com");
    }

    @Test
    @DisplayName("Create Post - Success")
    void shouldCreatePostSuccessfully() {
        CreatePostRequest request = new CreatePostRequest("Test Post", "Test Content");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(blogPostRepository.save(any(BlogPost.class))).thenReturn(post);


        BlogPostResponse response = blogPostService.createPost(request, "john@example.com");

        assertNotNull(response);
        assertEquals("Test Post", response.title());
        assertEquals("Test Content", response.content());
        verify(blogPostRepository).save(any(BlogPost.class));
    }

    @Test
    @DisplayName("Create Post - User Not Found")
    void shouldThrowWhenUserNotFoundForCreatePost() {
        CreatePostRequest request = new CreatePostRequest("New Post", "New Content");
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () ->
                blogPostService.createPost(request, "john@example.com"), "User not found");
    }

    @Test
    @DisplayName("Update Post - Success")
    void shouldUpdatePostSuccessfully() throws java.nio.file.AccessDeniedException {
        UpdatePostRequest request = new UpdatePostRequest("Updated Title", "Updated Content");
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(post));
        when(blogPostRepository.save(any(BlogPost.class))).thenReturn(post);


        BlogPostResponse response = blogPostService.updatePost(1L, request, "john@example.com");

        assertNotNull(response);
        assertEquals("Updated Title", response.title());
        assertEquals("Updated Content", response.content());
        verify(blogPostRepository).save(post);
    }

    @Test
    @DisplayName("Update Post - Not Found")
    void shouldThrowWhenPostNotFoundForUpdate() {
        UpdatePostRequest request = new UpdatePostRequest("Updated Title", "Updated Content");
        when(blogPostRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                        blogPostService.updatePost(1L, request, "john@example.com"),
                "Post not found with this id : 1");
    }

    @Test
    @DisplayName("Update Post - Access Denied")
    void shouldThrowAccessDeniedWhenNotAuthor() {
        UpdatePostRequest request = new UpdatePostRequest("Updated Title", "Updated Content");

        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(post));

        assertThrows(AccessDeniedException.class, () ->
                        blogPostService.updatePost(1L, request, "other@example.com"),
                "You can only update your own posts");
    }

    @Test
    @DisplayName("Delete Post - Success (Admin)")
    void shouldDeletePostSuccessfully() throws java.nio.file.AccessDeniedException {
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(post));
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(admin));

        blogPostService.deletePost(1L, "admin@example.com");

        verify(blogPostRepository).delete(post);
    }

    @Test
    @DisplayName("Delete Post - Not Found")
    void shouldThrowWhenPostNotFoundForDelete() {
        when(blogPostRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                        blogPostService.deletePost(1L, "admin@example.com"),
                "Post not found with this id : 1");
    }

    @Test
    @DisplayName("Delete Post - Access Denied (Non-Admin)")
    void shouldThrowAccessDeniedWhenNotAdmin() {
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(post));
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));

        assertThrows(AccessDeniedException.class, () ->
                        blogPostService.deletePost(1L, "john@example.com"),
                "Only Admin can delete posts");
    }

    @Test
    @DisplayName("Add Comment - Success (Same User, No Email)")
    void shouldAddCommentSuccessfullyWithoutEmail() {
        CreateCommentRequest request = new CreateCommentRequest("Nice post!");
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(post));
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);
        when(blogPostRepository.save(any(BlogPost.class))).thenReturn(post);
        when(commentMapper.toResponse(any(Comment.class))).thenReturn(
                new CommentResponse(1L, "Nice post!", "John Doe", LocalDateTime.now())
        );

        CommentResponse response = blogPostService.addComment(1L, request, "john@example.com");

        assertNotNull(response);
        assertEquals("Nice post!", response.content());
        verify(commentRepository).save(any(Comment.class));
        verify(blogPostRepository).save(post);
        verify(emailService, never()).sendCommentNotification(any(), any());
    }

    @Test
    @DisplayName("Add Comment - Success (Different User, Sends Email)")
    void shouldAddCommentAndSendEmailWhenDifferentUser() {
        CreateCommentRequest request = new CreateCommentRequest("Nice post!");

        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(post));
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(commenter));
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);
        when(blogPostRepository.save(any(BlogPost.class))).thenReturn(post);
        when(commentMapper.toResponse(any(Comment.class))).thenReturn(
                new CommentResponse(1L, "Nice post!", "Jane Doe", LocalDateTime.now())
        );

        CommentResponse response = blogPostService.addComment(1L, request, "jane@example.com");

        assertNotNull(response);
        assertEquals("Nice post!", response.content());
        assertEquals("Jane Doe", response.authorName());
        verify(commentRepository).save(any(Comment.class));
        verify(blogPostRepository).save(post);
        verify(emailService).sendCommentNotification(eq(user), any(Comment.class));
    }

    @Test
    @DisplayName("Add Comment - Post Not Found")
    void shouldThrowWhenPostNotFoundForAddComment() {
        CreateCommentRequest request = new CreateCommentRequest("Nice post!");
        when(blogPostRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                        blogPostService.addComment(1L, request, "john@example.com"),
                "post not found with this id : 1");
    }

    @Test
    @DisplayName("Get All Comments of Post - Success")
    void shouldGetAllCommentsOfPostSuccessfully() {
        post.setComments(List.of(comment));
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(post));
        when(commentMapper.toResponse(any(Comment.class))).thenReturn(
                new CommentResponse(1L, "Nice post!", "John Doe", LocalDateTime.now())
        );

        List<CommentResponse> responses = blogPostService.getAllCommentsOfPost(1L);

        assertFalse(responses.isEmpty());
        assertEquals("Nice post!", responses.get(0).content());
        verify(blogPostRepository).findById(1L);
    }

    @Test
    @DisplayName("Get All Comments of Post - Not Found")
    void shouldThrowWhenPostNotFoundForGetComments() {
        when(blogPostRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                        blogPostService.getAllCommentsOfPost(1L),
                "Post not found with this id : 1");
    }

    @Test
    @DisplayName("Update Comment - Success")
    void shouldUpdateCommentSuccessfully() throws java.nio.file.AccessDeniedException {
        CreateCommentRequest request = new CreateCommentRequest("Updated comment");
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);
        when(commentMapper.toResponse(any(Comment.class))).thenReturn(
                new CommentResponse(1L, "Updated comment", "John Doe", LocalDateTime.now())
        );

        CommentResponse response = blogPostService.updateComment(1L, request, "jane@example.com");

        assertNotNull(response);
        assertEquals("Updated comment", response.content());
        verify(commentRepository).save(comment);
    }

    @Test
    @DisplayName("Update Comment - Not Found")
    void shouldThrowWhenCommentNotFoundForUpdate() {
        CreateCommentRequest request = new CreateCommentRequest("Updated comment");
        when(commentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                        blogPostService.updateComment(1L, request, "john@example.com"),
                "Comment not found with this id : 1");
    }

    @Test
    @DisplayName("Update Comment - Access Denied")
    void shouldThrowUpdateCommentAccessDeniedWhenNotCommentAuthor() {
        CreateCommentRequest request = new CreateCommentRequest("Updated comment");
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        assertThrows(AccessDeniedException.class, () ->
                        blogPostService.updateComment(1L, request, "other@example.com"),
                "you can only update your own comments");
    }

    @Test
    @DisplayName("Delete Comment - Success")
    void shouldDeleteCommentSuccessfully() throws java.nio.file.AccessDeniedException {
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        blogPostService.deleteComment(1L, "jane@example.com");

        verify(commentRepository).delete(comment);
    }

    @Test
    @DisplayName("Delete Comment - Not Found")
    void shouldThrowWhenCommentNotFoundForDelete() {
        when(commentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                        blogPostService.deleteComment(1L, "john@example.com"),
                "Comment not found with this id : 1");
    }

    @Test
    @DisplayName("Delete Comment - Access Denied")
    void shouldThrowDeleteCommentAccessDeniedWhenNotCommentAuthor() {
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        assertThrows(AccessDeniedException.class, () ->
                        blogPostService.deleteComment(1L, "other@example.com"),
                "you can only delete your own comments");
    }

    @Test
    @DisplayName("Get User by Email - Success")
    void shouldGetUserByEmailSuccessfully() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));

        User result = blogPostService.getUserByEmail("john@example.com");

        assertNotNull(result);
        assertEquals("john@example.com", result.getEmail());
        verify(userRepository).findByEmail("john@example.com");
    }

    @Test
    @DisplayName("Get User by Email - Not Found")
    void shouldThrowWhenUserNotFoundByEmail() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () ->
                blogPostService.getUserByEmail("john@example.com"), "User not found");
    }
}
