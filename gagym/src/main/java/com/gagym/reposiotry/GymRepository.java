package com.gagym.reposiotry;

import com.gagym.entity.Gym;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface GymRepository extends JpaRepository<Gym, Long> {
    
    // 위치 기반 검색 (위도, 경도, 반경)
    @Query("SELECT g FROM Gym g WHERE " +
           "(6371 * acos(cos(radians(:latitude)) * cos(radians(g.latitude)) * " +
           "cos(radians(g.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(g.latitude)))) <= :radius")
    List<Gym> findByLocationWithinRadius(
            @Param("latitude") Double latitude,
            @Param("longitude") Double longitude,
            @Param("radius") Double radius);
    
    // 가격 범위 검색
    List<Gym> findByMonthlyFeeBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    // 이름으로 검색
    List<Gym> findByNameContainingIgnoreCase(String name);
    
    // 주소로 검색
    List<Gym> findByAddressContainingIgnoreCase(String address);
    
    // 평점 순으로 정렬
    Page<Gym> findAllByOrderByRatingDesc(Pageable pageable);
    
    // 최저가 순으로 정렬
    Page<Gym> findAllByOrderByMonthlyFeeAsc(Pageable pageable);
    
    // 시설 포함 검색 (JSON 필드)
    @Query("SELECT g FROM Gym g WHERE g.facilities LIKE %:facility%")
    List<Gym> findByFacilitiesContaining(@Param("facility") String facility);
} 