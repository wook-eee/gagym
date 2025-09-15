package com.gagym.reposiotry;

import com.gagym.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    List<Ticket> findByGymIdAndIsActiveTrue(Long gymId);
    
    List<Ticket> findByTypeAndGymId(Ticket.TicketType type, Long gymId);
    
    List<Ticket> findByQrCode(String qrCode);
} 