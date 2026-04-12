package com.felix.bms.mapper;

import com.felix.bms.dto.comment.CommentResponse;
import com.felix.bms.dto.user.AuthorSummary;
import com.felix.bms.entity.Comment;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {

    public CommentResponse toResponse(Comment comment){
        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                new AuthorSummary(
                        comment.getAuthor().getId(),
                        comment.getAuthor().getName(),
                        comment.getAuthor().getUsername(),
                        comment.getAuthor().getPicture(),
                        comment.getAuthor().getBio()
                ),
                comment.getCreatedAt(),
                comment.getReplies().stream()
                        .map(this::toResponse)
                        .toList()
        );
    }
}
