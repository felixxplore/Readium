package com.felix.bms.controller;

import com.felix.bms.dto.user.UpdateUserProfileRequest;
import com.felix.bms.dto.user.UserProfileResponse;
import com.felix.bms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(userService.getCurrentUserProfile(authentication.getName()));
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserProfileResponse> getPublicProfile(@PathVariable String username) {
        return ResponseEntity.ok(userService.getPublicProfile(username));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateUserProfile(
            Authentication authentication,
            @RequestBody UpdateUserProfileRequest request) {
        return ResponseEntity.ok(userService.updateUserProfile(authentication.getName(), request));
    }

    @GetMapping("/username-suggestions")
    public ResponseEntity<List<String>> suggestions(@RequestParam String name) {
        return ResponseEntity.ok(userService.generateUsernameSuggestions(name));
    }

    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> check(@RequestParam String username) {

        boolean available = userService.isUsernameAvailable(username);

        return ResponseEntity.ok(Map.of("available", available));
    }

    @PostMapping("/set-username")
    public ResponseEntity<?> setUsername(@RequestBody String username, Authentication auth){
        userService.setUsername(username, auth);

         return ResponseEntity.ok("username set successfully.");

    }


}
