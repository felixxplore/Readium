package com.felix.bms.entity;

import com.felix.bms.enums.AuthProvider;
import com.felix.bms.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users", uniqueConstraints = {
                @UniqueConstraint(columnNames = "email"),
                @UniqueConstraint(columnNames = "username")
})
@Getter
@Setter
@NoArgsConstructor
public class User {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false)
        private String name;

        @Column(  unique = true)
        private String username;

        @Column(nullable = false, unique = true)
        private String email;

        @Column(nullable = true)
        private String password;

        private String picture;

        @Column(length = 500)
        private String bio;

        @Enumerated(EnumType.STRING)
        private Role role = Role.USER;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private AuthProvider provider=AuthProvider.LOCAL;

        private String providerId;

    private boolean emailVerified = false;

}
