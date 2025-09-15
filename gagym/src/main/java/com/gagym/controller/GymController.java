package com.gagym.controller;

import com.gagym.dto.GymDto;
import com.gagym.service.GymService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/gyms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GymController {
    
    private final GymService gymService;
    
    // 모든 헬스장 조회
    @GetMapping
    public ResponseEntity<List<GymDto>> getAllGyms(@RequestParam(required = false) Long userId) {
        List<GymDto> gyms = gymService.getAllGyms(userId);
        return ResponseEntity.ok(gyms);
    }
    
    // ID로 헬스장 조회
    @GetMapping("/{gymId}")
    public ResponseEntity<GymDto> getGymById(@PathVariable Long gymId, @RequestParam(required = false) Long userId) {
        GymDto gym = gymService.getGymById(gymId, userId);
        return ResponseEntity.ok(gym);
    }
    
    // 위치 기반 헬스장 검색
    @GetMapping("/search/location")
    public ResponseEntity<List<GymDto>> searchGymsByLocation(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam Double radius,
            @RequestParam(required = false) Long userId) {
        List<GymDto> gyms = gymService.searchGymsByLocation(latitude, longitude, radius, userId);
        return ResponseEntity.ok(gyms);
    }
    
    // 가격 범위로 헬스장 검색
    @GetMapping("/search/price")
    public ResponseEntity<List<GymDto>> searchGymsByPrice(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice,
            @RequestParam(required = false) Long userId) {
        List<GymDto> gyms = gymService.searchGymsByPrice(minPrice, maxPrice, userId);
        return ResponseEntity.ok(gyms);
    }
    
    // 이름으로 헬스장 검색
    @GetMapping("/search/name")
    public ResponseEntity<List<GymDto>> searchGymsByName(
            @RequestParam String name,
            @RequestParam(required = false) Long userId) {
        List<GymDto> gyms = gymService.searchGymsByName(name, userId);
        return ResponseEntity.ok(gyms);
    }
    
    // 주소로 헬스장 검색
    @GetMapping("/search/address")
    public ResponseEntity<List<GymDto>> searchGymsByAddress(
            @RequestParam String address,
            @RequestParam(required = false) Long userId) {
        List<GymDto> gyms = gymService.searchGymsByAddress(address, userId);
        return ResponseEntity.ok(gyms);
    }
    
    // 시설로 헬스장 검색
    @GetMapping("/search/facility")
    public ResponseEntity<List<GymDto>> searchGymsByFacility(
            @RequestParam String facility,
            @RequestParam(required = false) Long userId) {
        List<GymDto> gyms = gymService.searchGymsByFacility(facility, userId);
        return ResponseEntity.ok(gyms);
    }
    
    // 평점 순으로 헬스장 조회
    @GetMapping("/sort/rating")
    public ResponseEntity<List<GymDto>> getGymsByRating(@RequestParam(required = false) Long userId) {
        List<GymDto> gyms = gymService.getGymsByRating(userId);
        return ResponseEntity.ok(gyms);
    }
    
    // 최저가 순으로 헬스장 조회
    @GetMapping("/sort/price")
    public ResponseEntity<List<GymDto>> getGymsByPrice(@RequestParam(required = false) Long userId) {
        List<GymDto> gyms = gymService.getGymsByPrice(userId);
        return ResponseEntity.ok(gyms);
    }
    
    // 헬스장 등록
    @PostMapping
    public ResponseEntity<GymDto> createGym(@RequestBody GymDto gymDto) {
        GymDto createdGym = gymService.createGym(gymDto);
        return ResponseEntity.ok(createdGym);
    }
    
    // 헬스장 수정
    @PutMapping("/{gymId}")
    public ResponseEntity<GymDto> updateGym(@PathVariable Long gymId, @RequestBody GymDto gymDto) {
        GymDto updatedGym = gymService.updateGym(gymId, gymDto);
        return ResponseEntity.ok(updatedGym);
    }
    
    // 헬스장 삭제
    @DeleteMapping("/{gymId}")
    public ResponseEntity<Void> deleteGym(@PathVariable Long gymId) {
        gymService.deleteGym(gymId);
        return ResponseEntity.ok().build();
    }
} 