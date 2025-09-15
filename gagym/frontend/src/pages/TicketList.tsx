import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './TicketList.css';

interface Ticket {
  id: number;
  name: string;
  type: string;
  price: number;
  gym: string;
  description: string;
  validPeriod: string;
}

const TicketList: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedType, setSelectedType] = useState('daily');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/tickets');
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('티켓 로딩 실패:', error);
      // 임시 데이터
      setTickets([
        {
          id: 1,
          name: "일일 이용권",
          type: "daily",
          price: 15000,
          gym: "강남 피트니스",
          description: "하루 동안 자유롭게 이용 가능",
          validPeriod: "1일"
        },
        {
          id: 2,
          name: "월 회원권",
          type: "monthly",
          price: 150000,
          gym: "강남 피트니스",
          description: "한 달 동안 자유롭게 이용 가능",
          validPeriod: "30일"
        },
        {
          id: 3,
          name: "P.T 1회 수업",
          type: "pt",
          price: 80000,
          gym: "강남 피트니스",
          description: "개인 트레이닝 1회 수업",
          validPeriod: "1회"
        }
      ]);
    }
  };

  const filteredTickets = tickets.filter(ticket => ticket.type === selectedType);

  const handlePurchase = async (ticketId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tickets/${ticketId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 1 }) // 임시 사용자 ID
      });
      
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '구매 완료!',
          text: '티켓 구매가 성공적으로 완료되었습니다.',
          confirmButtonColor: '#667eea',
          confirmButtonText: '확인'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '구매 실패',
          text: '구매에 실패했습니다. 다시 시도해주세요.',
          confirmButtonColor: '#667eea',
          confirmButtonText: '확인'
        });
      }
    } catch (error) {
      console.error('구매 실패:', error);
      Swal.fire({
        icon: 'error',
        title: '구매 실패',
        text: '서버 연결에 문제가 있습니다. 다시 시도해주세요.',
        confirmButtonColor: '#667eea',
        confirmButtonText: '확인'
      });
    }
  };

  return (
    <div className="ticket-list">
      <div className="container">
        <div className="page-header">
          <h1>일일권 구매</h1>
        </div>

        <div className="ticket-types">
          <div 
            className={`ticket-type-card ${selectedType === 'daily' ? 'active' : ''}`}
            onClick={() => setSelectedType('daily')}
          >
            <h3>일일권</h3>
            <p>하루 이용 가능</p>
          </div>
          <div 
            className={`ticket-type-card ${selectedType === 'monthly' ? 'active' : ''}`}
            onClick={() => setSelectedType('monthly')}
          >
            <h3>월회비</h3>
            <p>한 달 이용 가능</p>
          </div>
          <div 
            className={`ticket-type-card ${selectedType === 'pt' ? 'active' : ''}`}
            onClick={() => setSelectedType('pt')}
          >
            <h3>P.T 수업</h3>
            <p>개인 트레이닝</p>
          </div>
        </div>

        <div className="ticket-grid">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-content">
                <h3 className="ticket-name">{ticket.name}</h3>
                <p className="ticket-gym">{ticket.gym}</p>
                <p className="ticket-description">{ticket.description}</p>
                <div className="ticket-info">
                  <span className="ticket-valid-period">유효기간: {ticket.validPeriod}</span>
                </div>
                <div className="ticket-price">
                  <span>{ticket.price.toLocaleString()}원</span>
                </div>
                <div className="ticket-actions">
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handlePurchase(ticket.id)}
                  >
                    구매하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketList; 