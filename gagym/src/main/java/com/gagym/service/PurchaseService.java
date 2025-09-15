package com.gagym.service;

import com.gagym.dto.PurchaseDto;
import com.gagym.entity.Purchase;
import com.gagym.entity.Ticket;
import com.gagym.entity.User;
import com.gagym.reposiotry.PurchaseRepository;
import com.gagym.reposiotry.TicketRepository;
import com.gagym.reposiotry.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseService {
    
    private final PurchaseRepository purchaseRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    
    // 사용자의 모든 구매 내역 조회
    public List<PurchaseDto> getPurchasesByUserId(Long userId) {
        List<Purchase> purchases = purchaseRepository.findByUserId(userId);
        return purchases.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // 사용자의 활성 구매 내역 조회
    public List<PurchaseDto> getActivePurchasesByUserId(Long userId) {
        List<Purchase> purchases = purchaseRepository.findByUserIdAndStatus(userId, Purchase.PaymentStatus.COMPLETED);
        return purchases.stream()
                .filter(purchase -> !purchase.getIsUsed() && purchase.getExpiryDate().isAfter(LocalDateTime.now()))
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // QR 코드로 구매 내역 조회
    public PurchaseDto getPurchaseByQrCode(String qrCode) {
        Purchase purchase = purchaseRepository.findByQrCode(qrCode)
                .orElseThrow(() -> new RuntimeException("구매 내역을 찾을 수 없습니다."));
        return convertToDto(purchase);
    }
    
    // 티켓 구매
    public PurchaseDto purchaseTicket(Long userId, Long ticketId, Purchase.PaymentMethod paymentMethod) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("티켓을 찾을 수 없습니다."));
        
        Purchase purchase = Purchase.builder()
                .user(user)
                .ticket(ticket)
                .amount(ticket.getPrice())
                .paymentMethod(paymentMethod)
                .status(Purchase.PaymentStatus.COMPLETED)
                .expiryDate(LocalDateTime.now().plusDays(ticket.getValidDays()))
                .qrCode(generateQrCode())
                .isUsed(false)
                .build();
        
        Purchase savedPurchase = purchaseRepository.save(purchase);
        return convertToDto(savedPurchase);
    }
    
    // QR 코드 사용 (입장)
    public PurchaseDto useTicket(String qrCode) {
        Purchase purchase = purchaseRepository.findByQrCode(qrCode)
                .orElseThrow(() -> new RuntimeException("구매 내역을 찾을 수 없습니다."));
        
        if (purchase.getIsUsed()) {
            throw new RuntimeException("이미 사용된 티켓입니다.");
        }
        
        if (purchase.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("만료된 티켓입니다.");
        }
        
        purchase.setIsUsed(true);
        purchase.setUsedAt(LocalDateTime.now());
        
        Purchase updatedPurchase = purchaseRepository.save(purchase);
        return convertToDto(updatedPurchase);
    }
    
    // 구매 취소
    public void cancelPurchase(Long purchaseId) {
        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new RuntimeException("구매 내역을 찾을 수 없습니다."));
        
        if (purchase.getIsUsed()) {
            throw new RuntimeException("이미 사용된 티켓은 취소할 수 없습니다.");
        }
        
        purchase.setStatus(Purchase.PaymentStatus.CANCELLED);
        purchaseRepository.save(purchase);
    }
    
    // 만료된 티켓 조회
    public List<PurchaseDto> getExpiredPurchases() {
        List<Purchase> purchases = purchaseRepository.findByExpiryDateBefore(LocalDateTime.now());
        return purchases.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // QR 코드 생성
    private String generateQrCode() {
        return UUID.randomUUID().toString();
    }
    
    // DTO 변환
    private PurchaseDto convertToDto(Purchase purchase) {
        return PurchaseDto.builder()
                .id(purchase.getId())
                .userId(purchase.getUser().getId())
                .userName(purchase.getUser().getUsername())
                .ticketId(purchase.getTicket().getId())
                .ticketName(purchase.getTicket().getName())
                .ticketType(purchase.getTicket().getType().name())
                .amount(purchase.getAmount())
                .paymentMethod(purchase.getPaymentMethod().name())
                .paymentMethodDisplayName(purchase.getPaymentMethod().getDisplayName())
                .status(purchase.getStatus().name())
                .statusDisplayName(purchase.getStatus().getDisplayName())
                .purchaseDate(purchase.getPurchaseDate())
                .expiryDate(purchase.getExpiryDate())
                .qrCode(purchase.getQrCode())
                .isUsed(purchase.getIsUsed())
                .usedAt(purchase.getUsedAt())
                .gymId(purchase.getTicket().getGym().getId())
                .gymName(purchase.getTicket().getGym().getName())
                .createdAt(purchase.getCreatedAt())
                .updatedAt(purchase.getUpdatedAt())
                .build();
    }
} 