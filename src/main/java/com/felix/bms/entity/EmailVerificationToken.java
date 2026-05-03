package com.felix.bms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.Instant;

@Entity
@Data
public class EmailVerificationToken {

    @Id
    @GeneratedValue
    private Long id;

    private String token;

    @ManyToOne
    private User user;

    private Instant expiryDate;
}
