package com.felix.bms.repository;

import com.felix.bms.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {


    void deleteByUserEmail(String email);
    Optional<RefreshToken> findByToken(String refreshToken);
}
