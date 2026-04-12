package com.felix.bms.repository;

import com.felix.bms.entity.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    List<BlogPost> findByAuthor_Email(String email);

    Page<BlogPost> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<BlogPost> findByAuthor_EmailOrderByCreatedAtDesc(String email, Pageable pageable);

    Page<BlogPost> findByAuthor_UsernameOrderByCreatedAtDesc(String username, Pageable pageable);

    Page<BlogPost> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseOrderByCreatedAtDesc(
            String titleQuery,
            String contentQuery,
            Pageable pageable
    );
}
