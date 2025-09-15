package com.gagym.controller;

import com.gagym.dto.PurchaseDto;
import com.gagym.entity.Purchase;
import com.gagym.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PurchaseController {
    
    private final PurchaseService purchaseService;
    
    // 사용자의 모든 구매 내역 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PurchaseDto>> getPurchasesByUserId(@PathVariable Long userId) {
        List<PurchaseDto> purchases = purchaseService.getPurchasesByUserId(userId);
        return ResponseEntity.ok(purchases);
    }
    
    // 사용자의 활성 구매 내역 조회
    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<PurchaseDto>> getActivePurchasesByUserId(@PathVariable Long userId) {
        List<PurchaseDto> purchases = purchaseService.getActivePurchasesByUserId(userId);
        return ResponseEntity.ok(purchases);
    }
    
    // QR 코드로 구매 내역 조회
    @GetMapping("/qr/{qrCode}")
    public ResponseEntity<PurchaseDto> getPurchaseByQrCode(@PathVariable String qrCode) {
        PurchaseDto purchase = purchaseService.getPurchaseByQrCode(qrCode);
        return ResponseEntity.ok(purchase);
    }
    
    // 티켓 구매
    @PostMapping("/purchase")
    public ResponseEntity<PurchaseDto> purchaseTicket(
            @RequestParam Long userId,
            @RequestParam Long ticketId,
            @RequestParam String paymentMethod) {
        PurchaseDto purchase = purchaseService.purchaseTicket(
                userId, 
                ticketId, 
                Purchase.PaymentMethod.valueOf(paymentMethod));
        return ResponseEntity.ok(purchase);
    }
    
    // QR 코드 사용 (입장)
    @PostMapping("/use/{qrCode}")
    public ResponseEntity<PurchaseDto> useTicket(@PathVariable String qrCode) {
        PurchaseDto purchase = purchaseService.useTicket(qrCode);
        return ResponseEntity.ok(purchase);
    }
    
    // 구매 취소
    @PostMapping("/{purchaseId}/cancel")
    public ResponseEntity<Void> cancelPurchase(@PathVariable Long purchaseId) {
        purchaseService.cancelPurchase(purchaseId);
        return ResponseEntity.ok().build();
    }
    
    // 만료된 티켓 조회
    @GetMapping("/expired")
    public ResponseEntity<List<PurchaseDto>> getExpiredPurchases() {
        List<PurchaseDto> purchases = purchaseService.getExpiredPurchases();
        return ResponseEntity.ok(purchases);
    }
} 