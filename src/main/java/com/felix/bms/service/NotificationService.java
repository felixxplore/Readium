package com.felix.bms.service;

import com.felix.bms.dto.notification.NotificationResponse;
import com.felix.bms.entity.BlogPost;
import com.felix.bms.entity.Comment;
import com.felix.bms.entity.Notification;
import com.felix.bms.entity.User;
import com.felix.bms.enums.NotificationType;
import com.felix.bms.repository.NotificationRepository;
import com.felix.bms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createLikeNotification(User recipient, User actor, BlogPost post) {
        if (recipient.getId().equals(actor.getId())) {
            return;  // Don't notify user of their own actions
        }

        String message = actor.getName() + " liked your post: " + post.getTitle();
        createNotification(recipient, actor, NotificationType.POST_LIKED, message, post, null);
    }

    @Transactional
    public void createCommentNotification(User recipient, User actor, BlogPost post) {
        if (recipient.getId().equals(actor.getId())) {
            return;  // Don't notify user of their own actions
        }

        String message = actor.getName() + " commented on your post: " + post.getTitle();
        createNotification(recipient, actor, NotificationType.POST_COMMENTED, message, post, null);
    }

    @Transactional
    public void createReplyNotification(User recipient, User actor, Comment parentComment) {
        if (recipient.getId().equals(actor.getId())) {
            return;  // Don't notify user of their own actions
        }

        String message = actor.getName() + " replied to your comment";
        createNotification(recipient, actor, NotificationType.COMMENT_REPLIED, message, null, parentComment);
    }

    @Transactional
    public void createFollowNotification(User recipient, User actor) {
        if (recipient.getId().equals(actor.getId())) {
            return;  // Don't notify user of their own actions
        }

        String message = actor.getName() + " started following you";
        createNotification(recipient, actor, NotificationType.FOLLOW_USER, message, null, null);
    }

    @Transactional
    private void createNotification(User recipient, User actor, NotificationType type, String message, BlogPost post, Comment comment) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setActor(actor);
        notification.setType(type);
        notification.setMessage(message);
        notification.setPost(post);
        notification.setComment(comment);
        notification.setRead(false);

        notificationRepository.save(notification);
        log.info("Notification created for user: {}, type: {}", recipient.getId(), type);
    }

    public Page<NotificationResponse> getNotifications(String email, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user, pageable)
                .map(this::toResponse);
    }

    public Page<NotificationResponse> getUnreadNotifications(String email, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository.findByRecipientAndIsReadFalseOrderByCreatedAtDesc(user, pageable)
                .map(this::toResponse);
    }

    public long getUnreadCount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }

    @Transactional
    public void markAsRead(Long notificationId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        if (!notification.getRecipient().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Page<Notification> unreadNotifications = notificationRepository
                .findByRecipientAndIsReadFalseOrderByCreatedAtDesc(user, PageRequest.of(0, Integer.MAX_VALUE));

        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getActor().getName(),
                notification.getActor().getUsername(),
                notification.getActor().getPicture(),
                notification.getType(),
                notification.getMessage(),
                notification.getPost() != null ? notification.getPost().getId() : null,
                notification.getComment() != null ? notification.getComment().getId() : null,
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
