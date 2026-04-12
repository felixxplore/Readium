package com.felix.bms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "saved_posts",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "post_id"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SavedPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private BlogPost post;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public SavedPost(User user, BlogPost post) {
        this.user = user;
        this.post = post;
        this.createdAt = LocalDateTime.now();
    }
}
