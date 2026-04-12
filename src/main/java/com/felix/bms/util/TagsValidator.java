package com.felix.bms.util;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;

public class TagsValidator implements ConstraintValidator<ValidTags, List<String>> {

    private static final int MAX_TAGS = 5;
    private static final String TAG_PATTERN = "^#[a-zA-Z0-9_-]+$";

    @Override
    public boolean isValid(List<String> tags, ConstraintValidatorContext context) {
        if (tags == null || tags.isEmpty()) {
            return true; // Tags are optional
        }

        // Check maximum 5 tags
        if (tags.size() > MAX_TAGS) {
            addConstraintViolation(context, "Maximum 5 tags are allowed. You have " + tags.size());
            return false;
        }

        // Validate each tag
        for (String tag : tags) {
            if (tag == null || tag.isBlank()) {
                addConstraintViolation(context, "Tags cannot be empty");
                return false;
            }

            // Check if tag has spaces
            if (tag.contains(" ")) {
                addConstraintViolation(context, "Tag '" + tag + "' contains spaces. Tags should not have spaces");
                return false;
            }

            // Check if tag starts with # and contains only valid characters
            if (!tag.matches(TAG_PATTERN)) {
                addConstraintViolation(context, "Tag '" + tag + "' is invalid. Tags must start with # followed by alphanumeric characters, hyphens, or underscores");
                return false;
            }
        }

        return true;
    }

    private void addConstraintViolation(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message)
                .addConstraintViolation();
    }
}
