package com.gagym.controller;

import com.gagym.dto.TicketDto;
import com.gagym.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TicketController {
    
    private final TicketService ticketService;
    
    // 헬스장의 모든 티켓 조회
    @GetMapping("/gym/{gymId}")
    public ResponseEntity<List<TicketDto>> getTicketsByGymId(@PathVariable Long gymId) {
        List<TicketDto> tickets = ticketService.getTicketsByGymId(gymId);
        return ResponseEntity.ok(tickets);
    }
    
    // 티켓 타입별 조회
    @GetMapping("/gym/{gymId}/type/{type}")
    public ResponseEntity<List<TicketDto>> getTicketsByType(@PathVariable Long gymId, @PathVariable String type) {
        List<TicketDto> tickets = ticketService.getTicketsByType(gymId, com.gagym.entity.Ticket.TicketType.valueOf(type));
        return ResponseEntity.ok(tickets);
    }
    
    // QR 코드로 티켓 조회
    @GetMapping("/qr/{qrCode}")
    public ResponseEntity<TicketDto> getTicketByQrCode(@PathVariable String qrCode) {
        TicketDto ticket = ticketService.getTicketByQrCode(qrCode);
        return ResponseEntity.ok(ticket);
    }
    
    // 티켓 생성
    @PostMapping
    public ResponseEntity<TicketDto> createTicket(@RequestBody TicketDto ticketDto) {
        TicketDto createdTicket = ticketService.createTicket(ticketDto);
        return ResponseEntity.ok(createdTicket);
    }
    
    // 티켓 수정
    @PutMapping("/{ticketId}")
    public ResponseEntity<TicketDto> updateTicket(@PathVariable Long ticketId, @RequestBody TicketDto ticketDto) {
        TicketDto updatedTicket = ticketService.updateTicket(ticketId, ticketDto);
        return ResponseEntity.ok(updatedTicket);
    }
    
    // 티켓 비활성화
    @DeleteMapping("/{ticketId}")
    public ResponseEntity<Void> deactivateTicket(@PathVariable Long ticketId) {
        ticketService.deactivateTicket(ticketId);
        return ResponseEntity.ok().build();
    }
} 