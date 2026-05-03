package com.felix.bms.repository;

import com.felix.bms.entity.EmailVerificationToken;
import com.felix.bms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {


    Optional<EmailVerificationToken> findByToken(String token);

    void deleteByUser(User user);
}
