package com.gagym.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_verifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailVerification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String verificationCode;
    
    @Column(nullable = false)
    private Boolean isVerified = false;
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    
    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        expiresAt = LocalDateTime.now().plusMinutes(10); // 10분 유효
    }
} 