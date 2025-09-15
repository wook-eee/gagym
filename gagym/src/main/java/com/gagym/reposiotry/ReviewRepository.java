package com.gagym.reposiotry;

import com.gagym.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByGymIdOrderByCreatedAtDesc(Long gymId);
    
    List<Review> findByTrainerIdOrderByCreatedAtDesc(Long trainerId);
    
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Review> findByGymIdAndRating(Long gymId, Integer rating);
} 