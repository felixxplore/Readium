package com.felix.bms.controller;

import com.felix.bms.dto.image.ImageUploadResponse;
import com.felix.bms.service.ImageUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageUploadService imageUploadService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/profile")
    public ResponseEntity<ImageUploadResponse> uploadProfileImage(@RequestParam("file") MultipartFile file) {
        try {
            ImageUploadResponse response = imageUploadService.uploadProfileImage(file);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ImageUploadResponse(null, null, 0, null, "Error: " + e.getMessage()));
        }
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/post-cover")
    public ResponseEntity<ImageUploadResponse> uploadPostCoverImage(@RequestParam("file") MultipartFile file) {
        try {
            ImageUploadResponse response = imageUploadService.uploadPostCoverImage(file);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ImageUploadResponse(null, null, 0, null, "Error: " + e.getMessage()));
        }
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/blog")
    public ResponseEntity<ImageUploadResponse> uploadBlogImage(@RequestParam("file") MultipartFile file) {
        try {
            ImageUploadResponse response = imageUploadService.uploadBlogImage(file);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ImageUploadResponse(null, null, 0, null, "Error: " + e.getMessage()));
        }
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{publicId}")
    public ResponseEntity<String> deleteImage(@PathVariable String publicId) {
        try {
            imageUploadService.deleteImage(publicId);
            return ResponseEntity.ok("Image deleted successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error deleting image: " + e.getMessage());
        }
    }
}
