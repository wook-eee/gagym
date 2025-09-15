package com.gagym.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GymDto {
    
    private Long id;
    private String name;
    private String description;
    private String address;
    private String phoneNumber;
    private String businessHours;
    private Double latitude;
    private Double longitude;
    private BigDecimal monthlyFee;
    private BigDecimal dailyFee;
    private BigDecimal ptPrice;
    private List<String> facilities;
    private String imageUrl;
    private Double rating;
    private Integer reviewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isFavorite;
    private Double distance; // 현재 위치에서의 거리
} 