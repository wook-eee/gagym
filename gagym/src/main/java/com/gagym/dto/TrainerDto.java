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
public class TrainerDto {
    
    private Long id;
    private String name;
    private String description;
    private String phoneNumber;
    private String email;
    private String specialization;
    private Integer experienceYears;
    private BigDecimal ptPrice;
    private String imageUrl;
    private Double rating;
    private Integer reviewCount;
    private Long gymId;
    private String gymName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isFavorite;
} 