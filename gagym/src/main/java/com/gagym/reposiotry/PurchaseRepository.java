package com.gagym.reposiotry;

import com.gagym.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    
    List<Purchase> findByUserId(Long userId);
    
    List<Purchase> findByUserIdAndStatus(Long userId, Purchase.PaymentStatus status);
    
    Optional<Purchase> findByQrCode(String qrCode);
    
    List<Purchase> findByExpiryDateBefore(LocalDateTime date);
    
    List<Purchase> findByTicketGymId(Long gymId);
} 