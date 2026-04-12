package com.felix.bms.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.felix.bms.dto.image.ImageUploadResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageUploadService {

    private final Cloudinary cloudinary;

    public ImageUploadResponse uploadProfileImage(MultipartFile file) throws IOException {
        return uploadImage(file, "profile");
    }

    public ImageUploadResponse uploadPostCoverImage(MultipartFile file) throws IOException {
        return uploadImage(file, "post-cover");
    }

    public ImageUploadResponse uploadBlogImage(MultipartFile file) throws IOException {
        return uploadImage(file, "blog");
    }

    private ImageUploadResponse uploadImage(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        try {
            // Upload to Cloudinary with folder structure
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "bms/" + folder,
                            "resource_type", "auto",
                            "quality", "auto",
                            "aspect_ratio", "16:9"
                    )
            );

            return new ImageUploadResponse(
                    (String) uploadResult.get("secure_url"),
                    (String) uploadResult.get("public_id"),
                    (Long) uploadResult.get("bytes"),
                    (String) uploadResult.get("format"),
                    "Image uploaded successfully"
            );
        } catch (IOException e) {
            log.error("Error uploading image to Cloudinary: {}", e.getMessage());
            throw new IOException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    public void deleteImage(String publicId) throws IOException {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Image deleted successfully: {}", publicId);
        } catch (IOException e) {
            log.error("Error deleting image from Cloudinary: {}", e.getMessage());
            throw new IOException("Failed to delete image: " + e.getMessage(), e);
        }
    }
}
