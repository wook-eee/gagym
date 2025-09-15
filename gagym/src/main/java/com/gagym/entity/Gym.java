package com.gagym.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "gyms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Gym {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String address;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(name = "business_hours")
    private String businessHours;
    
    @Column(name = "latitude")
    private Double latitude;
    
    @Column(name = "longitude")
    private Double longitude;
    
    @Column(name = "monthly_fee")
    private BigDecimal monthlyFee;
    
    @Column(name = "daily_fee")
    private BigDecimal dailyFee;
    
    @Column(name = "pt_price")
    private BigDecimal ptPrice;
    
    @Column(name = "facilities", columnDefinition = "TEXT")
    private String facilities; // JSON 형태로 저장: ["헬스기구", "샤워시설", "주차장"]
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "rating")
    private Double rating = 0.0;
    
    @Column(name = "review_count")
    private Integer reviewCount = 0;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 