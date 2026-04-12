package com.felix.bms.util;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TagsValidator.class)
@Documented
public @interface ValidTags {
    String message() default "Tags must follow the format: max 5 tags, each starting with #, no spaces allowed";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
