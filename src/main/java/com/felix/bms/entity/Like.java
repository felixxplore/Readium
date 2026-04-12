package com.felix.bms.entity;

import com.felix.bms.enums.LikeType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "likes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "post_id"}, name = "uk_user_post_like"),
        @UniqueConstraint(columnNames = {"user_id", "comment_id"}, name = "uk_user_comment_like")
})
@Getter @Setter
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ONE of these will be filled
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private BlogPost post;        // ← for post likes

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id")
    private Comment comment;      // ← for comment likes

    private LocalDateTime createdAt = LocalDateTime.now();


}
