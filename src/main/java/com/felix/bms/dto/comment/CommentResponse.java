package com.felix.bms.dto.comment;

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
public class CommentResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String content;
    private AuthorSummary author;
    private LocalDateTime createdAt;
    private List<CommentResponse> replies;
}
