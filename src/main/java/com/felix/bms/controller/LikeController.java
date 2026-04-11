package com.felix.bms.controller;


import com.felix.bms.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private  LikeService likeService;

    @PostMapping("/post/{id}")
    public ResponseEntity<Void> likePost(@PathVariable Long id, Authentication auth) {
        likeService.likePost(id, auth.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/comment/{id}")
    public ResponseEntity<Void> likeComment(@PathVariable Long id, Authentication auth) {
        likeService.likeComment(id, auth.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/post/{id}/unlike")
    public ResponseEntity<Void> unlikePost(@PathVariable Long id, Authentication auth) {
        likeService.likePost(id, auth.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/comment/{id}/unlike")
    public ResponseEntity<Void> unlikeComment(@PathVariable Long id, Authentication auth) {
        likeService.likeComment(id, auth.getName());
        return ResponseEntity.ok().build();
    }
}
