package com.felix.bms.dto.image;

public record ImageUploadResponse(
        String url,
        String publicId,
        long size,
        String format,
        String message
) {
}
