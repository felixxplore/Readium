package com.felix.bms.service;


import com.felix.bms.dto.auth.AuthRequest;
import com.felix.bms.dto.auth.AuthResponse;
import com.felix.bms.dto.auth.RegisterRequest;
import com.felix.bms.dto.token.TokenRefreshRequest;
import com.felix.bms.entity.RefreshToken;
import com.felix.bms.entity.User;
import com.felix.bms.enums.Role;
import com.felix.bms.exception.InvalidRefreshTokenException;
import com.felix.bms.repository.UserRepository;
import com.felix.bms.security.JwtService;
import org.apache.coyote.BadRequestException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private RefreshTokenService refreshTokenService;

    @InjectMocks
    private AuthService authService;

    private User user;


    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setName("John Doe");
        user.setEmail("john@example.com");
        user.setPassword("encoded-password");
        user.setRole(Role.USER);

        // Set admin email via reflection (since it's final in your code)
        setField(authService, "adminEmail", "admin@example.com");
    }

    // Helper to set private field
    private void setField(Object target, String fieldName, Object value) {
        try {
            java.lang.reflect.Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    @DisplayName("Register - Success")
    void shouldRegisterUserSuccessfully() throws BadRequestException {
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "pass123");
        when(userRepository.existsByEmail(request.email())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(user);

        authService.register(request);

        verify(userRepository).save(argThat(u ->
                u.getEmail().equals("john@example.com") &&
                        u.getName().equals("John Doe")));
    }

    @Test
    @DisplayName("Register - Email already exists")
    void shouldThrowWhenEmailExists() {
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "pass123");
        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.register(request), "Email already in use");
    }

    @Test
    @DisplayName("Register - Admin email restricted")
    void shouldThrowWhenRegisteringAdminEmail() {
        RegisterRequest request = new RegisterRequest("Admin", "admin@example.com", "pass123");

        assertThrows(BadRequestException.class, () -> authService.register(request), "Admin account creation is restricted");
    }


    @Test
    @DisplayName("Login - Success")
    void shouldLoginSuccessfully() {
        AuthRequest request = new AuthRequest("john@example.com", "pass123");

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken("refresh-token");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn("access-token");
        when(refreshTokenService.createRefreshToken("john@example.com")).thenReturn(refreshToken);

        // when
        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("access-token", response.accessToken());
        assertEquals("refresh-token", response.refreshToken());

        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken("john@example.com", "pass123")
        );
    }

    @Test
    @DisplayName("Login - User not found")
    void shouldThrowWhenUserNotFound() {
        AuthRequest request = new AuthRequest("john@example.com", "pass123");
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> authService.login(request), "User not found");
        verify(userRepository).findByEmail("john@example.com");
        verify(jwtService, never()).generateToken(any());
        verify(refreshTokenService, never()).createRefreshToken(any());
    }

    @Test
    @DisplayName("Refresh Token - get new access token")
    void shouldRefreshTokenSuccessfully(){
        TokenRefreshRequest request=new TokenRefreshRequest("refresh-token");

        when(jwtService.extractUsername("refresh-token")).thenReturn("john@example.com");
        when(refreshTokenService.isValidRefreshToken("refresh-token","john@example.com")).thenReturn(true);
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn("new-access-token");

        RefreshToken newRefreshToken=new RefreshToken();
        newRefreshToken.setToken("new-refresh-token");

        when(refreshTokenService.rotateRefreshToken("refresh-token")).thenReturn(newRefreshToken);

        AuthResponse response=authService.refreshToken(request);

        assertNotNull(response);
        assertEquals("new-access-token", response.accessToken());
        assertEquals("new-refresh-token", response.refreshToken());

        verify(jwtService).extractUsername("refresh-token");
        verify(refreshTokenService).isValidRefreshToken("refresh-token","john@example.com");
        verify(userRepository).findByEmail("john@example.com");
        verify(jwtService).generateToken(any(UserDetails.class));
        verify(refreshTokenService).rotateRefreshToken("refresh-token");
    }

    @Test
    @DisplayName("Refresh Token - Invalid Refresh token")
    void shouldThrowWhenInvalidRefreshToken(){
        TokenRefreshRequest request=new TokenRefreshRequest("refresh-token");

        when(jwtService.extractUsername("refresh-token")).thenReturn("john@example.com");
        when(refreshTokenService.isValidRefreshToken("refresh-token","john@example.com")).thenReturn(false);

        assertThrows(InvalidRefreshTokenException.class,()-> authService.refreshToken(request),"Invalid or Expired refresh token");

        verify(jwtService).extractUsername("refresh-token");
        verify(refreshTokenService).isValidRefreshToken("refresh-token","john@example.com");
        verify(jwtService, never()).generateToken(any());
        verify(refreshTokenService, never()).rotateRefreshToken(any());
    }


}
