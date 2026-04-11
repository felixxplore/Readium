package com.felix.bms.service;

import com.felix.bms.entity.RefreshToken;
import com.felix.bms.entity.User;
import com.felix.bms.exception.InvalidRefreshTokenException;
import com.felix.bms.repository.RefreshTokenRepository;
import com.felix.bms.repository.UserRepository;
import com.felix.bms.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    // create refresh token service
    // validate refresh token
    // rotate refresh token


    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${jwt.refresh-expiration-ms}")
    private long refreshTokenExpiration;


    @Transactional
    public RefreshToken createRefreshToken(String email){

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("user not found"));

        refreshTokenRepository.deleteByUserEmail(email); // revoke old tokens

        RefreshToken refreshToken=new RefreshToken();
        refreshToken.setToken(jwtService.generateRefreshToken(email));
        refreshToken.setUser(user);
        refreshToken.setExpiredDate(Instant.now().plusMillis(refreshTokenExpiration));

     return refreshTokenRepository.save(refreshToken);
    }

    public boolean isValidRefreshToken(String refreshToken, String email){

        return refreshTokenRepository.findByToken(refreshToken)
                .filter(t-> t.getUser().getEmail().equals(email))
                .filter(t-> t.getExpiredDate().isAfter(Instant.now()))
                .isPresent();
    }


    @Transactional
    public RefreshToken rotateRefreshToken(String token){

       RefreshToken oldToken = refreshTokenRepository.findByToken(token)
                        .orElseThrow(()-> new InvalidRefreshTokenException("Refresh Token not found"));

        refreshTokenRepository.delete(oldToken);
        return createRefreshToken(oldToken.getUser().getEmail());
    }


}
