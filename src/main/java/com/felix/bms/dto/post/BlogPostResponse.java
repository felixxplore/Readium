package com.felix.bms.dto.post;

import com.felix.bms.dto.comment.CommentResponse;
import com.felix.bms.dto.user.AuthorSummary;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String title;
    private String subtitle;
    private String content;
    private String excerpt;
    private String coverImage;
    private List<String> tags;
    private AuthorSummary author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long likeCount;
    private List<CommentResponse> comments;
}
