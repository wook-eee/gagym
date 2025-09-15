package com.gagym.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trainers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Trainer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "specialization")
    private String specialization; // 전문 분야: "다이어트", "근력운동", "요가" 등
    
    @Column(name = "experience_years")
    private Integer experienceYears;
    
    @Column(name = "pt_price")
    private BigDecimal ptPrice;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "rating")
    private Double rating = 0.0;
    
    @Column(name = "review_count")
    private Integer reviewCount = 0;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_id")
    private Gym gym;
    
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