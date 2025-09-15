package com.gagym.reposiotry;

import com.gagym.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    
    List<Favorite> findByUserId(Long userId);
    
    List<Favorite> findByUserIdAndGymId(Long userId, Long gymId);
    
    List<Favorite> findByUserIdAndTrainerId(Long userId, Long trainerId);
    
    Optional<Favorite> findByUserIdAndGymIdAndTrainerIdIsNull(Long userId, Long gymId);
    
    Optional<Favorite> findByUserIdAndTrainerIdAndGymIdIsNull(Long userId, Long trainerId);
    
    boolean existsByUserIdAndGymId(Long userId, Long gymId);
    
    boolean existsByUserIdAndTrainerId(Long userId, Long trainerId);
} 