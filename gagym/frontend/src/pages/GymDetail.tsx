import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './GymDetail.css';

interface Gym {
  id: number;
  name: string;
  address: string;
  rating: number;
  monthlyFee: number;
  facilities: string[];
  description: string;
  operatingHours: string;
  phone: string;
  images: string[];
}

const GymDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [gym, setGym] = useState<Gym | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      loadGymDetail(parseInt(id));
    }
  }, [id]);

  const loadGymDetail = async (gymId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/gyms/${gymId}`);
      const data = await response.json();
      setGym(data);
    } catch (error) {
      console.error('헬스장 상세 정보 로딩 실패:', error);
      // 임시 데이터
      setGym({
        id: gymId,
        name: "강남 피트니스",
        address: "서울 강남구 역삼동 123-45",
        rating: 4.8,
        monthlyFee: 150000,
        facilities: ["헬스기구", "샤워시설", "주차장", "사우나", "요가룸"],
        description: "강남역 근처에 위치한 프리미엄 피트니스 센터입니다. 최신 운동기구와 전문 트레이너가 준비되어 있습니다.",
        operatingHours: "06:00 - 24:00",
        phone: "02-1234-5678",
        images: ["gym1.jpg", "gym2.jpg", "gym3.jpg"]
      });
    }
  };

  const toggleFavorite = async () => {
    if (!gym) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/gyms/${gym.id}/favorite`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 1 }) // 임시 사용자 ID
      });
      
      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('찜하기 실패:', error);
    }
  };

  if (!gym) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="gym-detail">
      <div className="container">
        <div className="gym-header">
          <div className="gym-info">
            <h1>{gym.name}</h1>
            <p className="gym-address">{gym.address}</p>
            <div className="gym-rating">
              <i className="fas fa-star"></i>
              <span>{gym.rating}</span>
            </div>
          </div>
          <div className="gym-actions">
            <button 
              className={`btn ${isFavorite ? 'btn-primary' : 'btn-outline'}`}
              onClick={toggleFavorite}
            >
              <i className={`fas fa-heart ${isFavorite ? 'filled' : ''}`}></i>
              {isFavorite ? '찜 해제' : '찜하기'}
            </button>
          </div>
        </div>

        <div className="gym-content">
          <div className="gym-main">
            <div className="gym-images">
              <div className="main-image">
                <i className="fas fa-dumbbell"></i>
              </div>
            </div>

            <div className="gym-details">
              <div className="detail-section">
                <h3>헬스장 정보</h3>
                <p>{gym.description}</p>
              </div>

              <div className="detail-section">
                <h3>운영시간</h3>
                <p>{gym.operatingHours}</p>
              </div>

              <div className="detail-section">
                <h3>연락처</h3>
                <p>{gym.phone}</p>
              </div>

              <div className="detail-section">
                <h3>시설</h3>
                <div className="facilities">
                  {gym.facilities.map((facility, index) => (
                    <span key={index} className="facility-tag">{facility}</span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>가격</h3>
                <p className="price">월 {gym.monthlyFee.toLocaleString()}원</p>
              </div>
            </div>
          </div>

          <div className="gym-sidebar">
            <div className="ticket-options">
              <h3>이용권 구매</h3>
              <div className="ticket-option">
                <span>일일권</span>
                <span>15,000원</span>
                <button className="btn btn-primary">구매</button>
              </div>
              <div className="ticket-option">
                <span>월회비</span>
                <span>{gym.monthlyFee.toLocaleString()}원</span>
                <button className="btn btn-primary">구매</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymDetail; 