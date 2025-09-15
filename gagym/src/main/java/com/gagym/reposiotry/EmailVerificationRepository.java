package com.gagym.reposiotry;

import com.gagym.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    
    Optional<EmailVerification> findByEmailAndVerificationCode(String email, String verificationCode);
    
    Optional<EmailVerification> findByEmailOrderByCreatedAtDesc(String email);
    
    void deleteByExpiresAtBefore(LocalDateTime date);
} 