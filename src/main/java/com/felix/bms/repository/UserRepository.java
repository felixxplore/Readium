package com.felix.bms.repository;

import com.felix.bms.entity.User;
import com.felix.bms.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String username);

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByRole(Role role);

    @Query(value = "SELECT id FROM users WHERE email = :email", nativeQuery = true)
    Long findIdByEmail(String email);

    boolean existsByUsernameIgnoreCase(String normalized);
}
