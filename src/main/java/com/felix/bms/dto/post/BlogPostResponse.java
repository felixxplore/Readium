package com.felix.bms.dto.post;

import com.felix.bms.dto.comment.CommentResponse;
import com.felix.bms.dto.user.AuthorSummary;

import java.time.LocalDateTime;
import java.util.List;

public record BlogPostResponse(
        Long id,
        String title,
        String subtitle,
        String content,
        String excerpt,
        String coverImage,
        List<String> tags,
        AuthorSummary author,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        long likeCount,
        List<CommentResponse> comments) {

}
