import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import './TrainerDetail.css';

interface Trainer {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  price: number;
  gym: string;
  description: string;
  certifications: string[];
  image: string;
}

const TrainerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      loadTrainerDetail(parseInt(id));
    }
  }, [id]);

  const loadTrainerDetail = async (trainerId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/trainers/${trainerId}`);
      const data = await response.json();
      setTrainer(data);
    } catch (error) {
      console.error('트레이너 상세 정보 로딩 실패:', error);
      // 임시 데이터
      setTrainer({
        id: trainerId,
        name: "김철수",
        specialization: "다이어트",
        experience: 5,
        rating: 4.8,
        price: 80000,
        gym: "강남 피트니스",
        description: "5년간의 경험을 바탕으로 개인 맞춤형 다이어트 프로그램을 제공합니다. 체계적인 운동과 영양 관리로 목표 달성을 도와드립니다.",
        certifications: ["생활스포츠지도사 2급", "체형관리 전문가", "영양사 자격증"],
        image: "trainer1.jpg"
      });
    }
  };

  const toggleFavorite = async () => {
    if (!trainer) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/trainers/${trainer.id}/favorite`, {
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

  const handleBooking = async () => {
    if (!trainer) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/trainers/${trainer.id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: 1,
          date: new Date().toISOString().split('T')[0]
        })
      });
      
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '예약 완료!',
          text: '트레이너 예약이 성공적으로 완료되었습니다.',
          confirmButtonColor: '#667eea',
          confirmButtonText: '확인'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '예약 실패',
          text: '예약에 실패했습니다. 다시 시도해주세요.',
          confirmButtonColor: '#667eea',
          confirmButtonText: '확인'
        });
      }
    } catch (error) {
      console.error('예약 실패:', error);
      Swal.fire({
        icon: 'error',
        title: '예약 실패',
        text: '서버 연결에 문제가 있습니다. 다시 시도해주세요.',
        confirmButtonColor: '#667eea',
        confirmButtonText: '확인'
      });
    }
  };

  if (!trainer) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="trainer-detail">
      <div className="container">
        <div className="trainer-header">
          <div className="trainer-info">
            <div className="trainer-profile">
              <div className="trainer-image">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="trainer-basic-info">
                <h1>{trainer.name}</h1>
                <p className="trainer-gym">{trainer.gym}</p>
                <div className="trainer-rating">
                  <i className="fas fa-star"></i>
                  <span>{trainer.rating}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="trainer-actions">
            <button 
              className={`btn ${isFavorite ? 'btn-primary' : 'btn-outline'}`}
              onClick={toggleFavorite}
            >
              <i className={`fas fa-heart ${isFavorite ? 'filled' : ''}`}></i>
              {isFavorite ? '찜 해제' : '찜하기'}
            </button>
          </div>
        </div>

        <div className="trainer-content">
          <div className="trainer-main">
            <div className="trainer-details">
              <div className="detail-section">
                <h3>전문 분야</h3>
                <p>{trainer.specialization}</p>
              </div>

              <div className="detail-section">
                <h3>경력</h3>
                <p>{trainer.experience}년</p>
              </div>

              <div className="detail-section">
                <h3>소개</h3>
                <p>{trainer.description}</p>
              </div>

              <div className="detail-section">
                <h3>자격증</h3>
                <div className="certifications">
                  {trainer.certifications.map((cert, index) => (
                    <span key={index} className="certification-tag">{cert}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="trainer-sidebar">
            <div className="booking-section">
              <h3>P.T 예약</h3>
              <div className="price-info">
                <span className="price">1회 {trainer.price.toLocaleString()}원</span>
              </div>
              <button className="btn btn-primary" onClick={handleBooking}>
                예약하기
              </button>
            </div>

            <div className="schedule-section">
              <h3>운영시간</h3>
              <p>평일: 09:00 - 21:00</p>
              <p>주말: 10:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDetail; 