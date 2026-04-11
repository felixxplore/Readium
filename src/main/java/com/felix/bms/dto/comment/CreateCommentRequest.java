package com.felix.bms.dto.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCommentRequest(
        @NotBlank(message = "Content is required")
        @Size(min = 1, max = 1000, message = "Comment must be between 1 and 1000 characters")
        String content

) {
}
