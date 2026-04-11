package com.felix.bms.dto.post;

import com.felix.bms.dto.comment.CommentResponse;

import java.time.LocalDateTime;
import java.util.List;

public record BlogPostResponse(
        Long id,
        String title,
        String content,
        String authorName,
        LocalDateTime createdAt,
        List<CommentResponse> comments) {

}
