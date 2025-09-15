package com.gagym.reposiotry;

import com.gagym.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    
    List<Trainer> findByGymId(Long gymId);
    
    List<Trainer> findBySpecializationContainingIgnoreCase(String specialization);
    
    List<Trainer> findByExperienceYearsGreaterThanEqual(Integer experienceYears);
    
    List<Trainer> findAllByOrderByRatingDesc();
} 