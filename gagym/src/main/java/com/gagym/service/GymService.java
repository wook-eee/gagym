package com.gagym.service;

import com.gagym.dto.GymDto;
import com.gagym.entity.Gym;
import com.gagym.reposiotry.GymRepository;
import com.gagym.reposiotry.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class GymService {
    
    private final GymRepository gymRepository;
    private final FavoriteRepository favoriteRepository;
    
    // 모든 헬스장 조회
    public List<GymDto> getAllGyms(Long userId) {
        List<Gym> gyms = gymRepository.findAll();
        return gyms.stream()
                .map(gym -> convertToDto(gym, userId))
                .collect(Collectors.toList());
    }
    
    // ID로 헬스장 조회
    public GymDto getGymById(Long gymId, Long userId) {
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("헬스장을 찾을 수 없습니다."));
        return convertToDto(gym, userId);
    }
    
    // 위치 기반 헬스장 검색
    public List<GymDto> searchGymsByLocation(Double latitude, Double longitude, Double radius, Long userId) {
        List<Gym> gyms = gymRepository.findByLocationWithinRadius(latitude, longitude, radius);
        return gyms.stream()
                .map(gym -> convertToDto(gym, userId))
                .collect(Collectors.toList());
    }
    
    // 가격 범위로 헬스장 검색
    public List<GymDto> searchGymsByPrice(BigDecimal minPrice, BigDecimal maxPrice, Long userId) {
        List<Gym> gyms = gymRepository.findByMonthlyFeeBetween(minPrice, maxPrice);
        return gyms.stream()
                .map(gym -> convertToDto(gym, userId))
                .collect(Collectors.toList());
    }
    
    // 이름으로 헬스장 검색
    public List<GymDto> searchGymsByName(String name, Long userId) {
        List<Gym> gyms = gymRepository.findByNameContainingIgnoreCase(name);
        return gyms.stream()
                .map(gym -> convertToDto(gym, userId))
                .collect(Collectors.toList());
    }
    
    // 주소로 헬스장 검색
    public List<GymDto> searchGymsByAddress(String address, Long userId) {
        List<Gym> gyms = gymRepository.findByAddressContainingIgnoreCase(address);
        return gyms.stream()
                .map(gym -> convertToDto(gym, userId))
                .collect(Collectors.toList());
    }
    
    // 시설로 헬스장 검색
    public List<GymDto> searchGymsByFacility(String facility, Long userId) {
        List<Gym> gyms = gymRepository.findByFacilitiesContaining(facility);
        return gyms.stream()
                .map(gym -> convertToDto(gym, userId))
                .collect(Collectors.toList());
    }
    
    // 평점 순으로 헬스장 조회
    public List<GymDto> getGymsByRating(Long userId) {
        List<Gym> gyms = gymRepository.findAllByOrderByRatingDesc(null).getContent();
        return gyms.stream()
                .map(gym -> convertToDto(gym, userId))
                .collect(Collectors.toList());
    }
    
    // 최저가 순으로 헬스장 조회
    public List<GymDto> getGymsByPrice(Long userId) {
        List<Gym> gyms = gymRepository.findAllByOrderByMonthlyFeeAsc(null).getContent();
        return gyms.stream()
                .map(gym -> convertToDto(gym, userId))
                .collect(Collectors.toList());
    }
    
    // 헬스장 등록
    public GymDto createGym(GymDto gymDto) {
        Gym gym = Gym.builder()
                .name(gymDto.getName())
                .description(gymDto.getDescription())
                .address(gymDto.getAddress())
                .phoneNumber(gymDto.getPhoneNumber())
                .businessHours(gymDto.getBusinessHours())
                .latitude(gymDto.getLatitude())
                .longitude(gymDto.getLongitude())
                .monthlyFee(gymDto.getMonthlyFee())
                .dailyFee(gymDto.getDailyFee())
                .ptPrice(gymDto.getPtPrice())
                .facilities(String.join(",", gymDto.getFacilities()))
                .imageUrl(gymDto.getImageUrl())
                .build();
        
        Gym savedGym = gymRepository.save(gym);
        return convertToDto(savedGym, null);
    }
    
    // 헬스장 수정
    public GymDto updateGym(Long gymId, GymDto gymDto) {
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("헬스장을 찾을 수 없습니다."));
        
        gym.setName(gymDto.getName());
        gym.setDescription(gymDto.getDescription());
        gym.setAddress(gymDto.getAddress());
        gym.setPhoneNumber(gymDto.getPhoneNumber());
        gym.setBusinessHours(gymDto.getBusinessHours());
        gym.setLatitude(gymDto.getLatitude());
        gym.setLongitude(gymDto.getLongitude());
        gym.setMonthlyFee(gymDto.getMonthlyFee());
        gym.setDailyFee(gymDto.getDailyFee());
        gym.setPtPrice(gymDto.getPtPrice());
        gym.setFacilities(String.join(",", gymDto.getFacilities()));
        gym.setImageUrl(gymDto.getImageUrl());
        
        Gym updatedGym = gymRepository.save(gym);
        return convertToDto(updatedGym, null);
    }
    
    // 헬스장 삭제
    public void deleteGym(Long gymId) {
        gymRepository.deleteById(gymId);
    }
    
    // DTO 변환
    private GymDto convertToDto(Gym gym, Long userId) {
        Boolean isFavorite = false;
        if (userId != null) {
            isFavorite = favoriteRepository.existsByUserIdAndGymId(userId, gym.getId());
        }
        
        return GymDto.builder()
                .id(gym.getId())
                .name(gym.getName())
                .description(gym.getDescription())
                .address(gym.getAddress())
                .phoneNumber(gym.getPhoneNumber())
                .businessHours(gym.getBusinessHours())
                .latitude(gym.getLatitude())
                .longitude(gym.getLongitude())
                .monthlyFee(gym.getMonthlyFee())
                .dailyFee(gym.getDailyFee())
                .ptPrice(gym.getPtPrice())
                .facilities(List.of(gym.getFacilities().split(",")))
                .imageUrl(gym.getImageUrl())
                .rating(gym.getRating())
                .reviewCount(gym.getReviewCount())
                .createdAt(gym.getCreatedAt())
                .updatedAt(gym.getUpdatedAt())
                .isFavorite(isFavorite)
                .build();
    }
} 