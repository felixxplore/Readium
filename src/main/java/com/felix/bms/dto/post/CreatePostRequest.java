package com.felix.bms.dto.post;

import com.felix.bms.util.ValidTags;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreatePostRequest(
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
        String title,

        @Size(max = 255, message = "Subtitle must be at most 255 characters")
        String subtitle,

        @Size(max = 500, message = "Excerpt must be at most 500 characters")
        String excerpt,

        String coverImage,

        @ValidTags
        List<String> tags,

        @NotBlank(message = "Content is required")
        @Size(min = 10, message = "Content must be at least 10 characters")
        String content
) {
}
