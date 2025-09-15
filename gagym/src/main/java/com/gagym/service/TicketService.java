package com.gagym.service;

import com.gagym.dto.TicketDto;
import com.gagym.entity.Ticket;
import com.gagym.entity.Gym;
import com.gagym.reposiotry.TicketRepository;
import com.gagym.reposiotry.GymRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketService {
    
    private final TicketRepository ticketRepository;
    private final GymRepository gymRepository;
    
    // 헬스장의 모든 티켓 조회
    public List<TicketDto> getTicketsByGymId(Long gymId) {
        List<Ticket> tickets = ticketRepository.findByGymIdAndIsActiveTrue(gymId);
        return tickets.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // 티켓 타입별 조회
    public List<TicketDto> getTicketsByType(Long gymId, Ticket.TicketType type) {
        List<Ticket> tickets = ticketRepository.findByTypeAndGymId(type, gymId);
        return tickets.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // QR 코드로 티켓 조회
    public TicketDto getTicketByQrCode(String qrCode) {
        List<Ticket> tickets = ticketRepository.findByQrCode(qrCode);
        if (tickets.isEmpty()) {
            throw new RuntimeException("티켓을 찾을 수 없습니다.");
        }
        return convertToDto(tickets.get(0));
    }
    
    // 티켓 생성
    public TicketDto createTicket(TicketDto ticketDto) {
        Gym gym = gymRepository.findById(ticketDto.getGymId())
                .orElseThrow(() -> new RuntimeException("헬스장을 찾을 수 없습니다."));
        
        Ticket ticket = Ticket.builder()
                .type(Ticket.TicketType.valueOf(ticketDto.getType()))
                .name(ticketDto.getName())
                .description(ticketDto.getDescription())
                .price(ticketDto.getPrice())
                .validDays(ticketDto.getValidDays())
                .qrCode(generateQrCode())
                .gym(gym)
                .isActive(true)
                .build();
        
        Ticket savedTicket = ticketRepository.save(ticket);
        return convertToDto(savedTicket);
    }
    
    // 티켓 수정
    public TicketDto updateTicket(Long ticketId, TicketDto ticketDto) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("티켓을 찾을 수 없습니다."));
        
        ticket.setName(ticketDto.getName());
        ticket.setDescription(ticketDto.getDescription());
        ticket.setPrice(ticketDto.getPrice());
        ticket.setValidDays(ticketDto.getValidDays());
        ticket.setIsActive(ticketDto.getIsActive());
        
        Ticket updatedTicket = ticketRepository.save(ticket);
        return convertToDto(updatedTicket);
    }
    
    // 티켓 삭제 (비활성화)
    public void deactivateTicket(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("티켓을 찾을 수 없습니다."));
        
        ticket.setIsActive(false);
        ticketRepository.save(ticket);
    }
    
    // QR 코드 생성
    private String generateQrCode() {
        return UUID.randomUUID().toString();
    }
    
    // DTO 변환
    private TicketDto convertToDto(Ticket ticket) {
        return TicketDto.builder()
                .id(ticket.getId())
                .type(ticket.getType().name())
                .typeDisplayName(ticket.getType().getDisplayName())
                .name(ticket.getName())
                .description(ticket.getDescription())
                .price(ticket.getPrice())
                .validDays(ticket.getValidDays())
                .qrCode(ticket.getQrCode())
                .gymId(ticket.getGym().getId())
                .gymName(ticket.getGym().getName())
                .isActive(ticket.getIsActive())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
} 