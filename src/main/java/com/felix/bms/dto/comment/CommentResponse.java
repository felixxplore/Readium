package com.felix.bms.dto.comment;

import com.felix.bms.dto.user.AuthorSummary;

import java.time.LocalDateTime;
import java.util.List;

public record CommentResponse(
        Long id,
        String content,
        AuthorSummary author,
        LocalDateTime createdAt,
        List<CommentResponse> replies
) {
}
