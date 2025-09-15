package com.gagym.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseDto {
    
    private Long id;
    private Long userId;
    private String userName;
    private Long ticketId;
    private String ticketName;
    private String ticketType;
    private BigDecimal amount;
    private String paymentMethod;
    private String paymentMethodDisplayName;
    private String status;
    private String statusDisplayName;
    private LocalDateTime purchaseDate;
    private LocalDateTime expiryDate;
    private String qrCode;
    private Boolean isUsed;
    private LocalDateTime usedAt;
    private Long gymId;
    private String gymName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 