package com.felix.bms.dto.post;

import com.felix.bms.entity.SavedPost;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedPostResponse {

    private Long id;
    private Long postId;
    private String title;
    private String subtitle;
    private String excerpt;
    private String coverImage;
    private String authorName;
    private String authorUsername;
    private String authorPicture;
    private LocalDateTime postCreatedAt;
    private LocalDateTime savedAt;

    public static SavedPostResponse fromEntity(SavedPost savedPost) {
        return SavedPostResponse.builder()
                .id(savedPost.getId())
                .postId(savedPost.getPost().getId())
                .title(savedPost.getPost().getTitle())
                .subtitle(savedPost.getPost().getSubtitle())
                .excerpt(savedPost.getPost().getExcerpt())
                .coverImage(savedPost.getPost().getCoverImage())
                .authorName(savedPost.getPost().getAuthor().getName())
                .authorUsername(savedPost.getPost().getAuthor().getUsername())
                .authorPicture(savedPost.getPost().getAuthor().getPicture())
                .postCreatedAt(savedPost.getPost().getCreatedAt())
                .savedAt(savedPost.getCreatedAt())
                .build();
    }
}
