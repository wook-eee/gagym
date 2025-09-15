package com.gagym.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {
    
    private Long id;
    private Long userId;
    private String userName;
    private Long gymId;
    private String gymName;
    private Long trainerId;
    private String trainerName;
    private Integer rating;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 