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
public class TicketDto {
    
    private Long id;
    private String type;
    private String typeDisplayName;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer validDays;
    private String qrCode;
    private Long gymId;
    private String gymName;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 