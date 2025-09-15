import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TrainerList.css';

interface Trainer {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  price: number;
  gym: string;
  image: string;
}

const TrainerList: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [specialization, setSpecialization] = useState('');

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/trainers');
      const data = await response.json();
      setTrainers(data);
    } catch (error) {
      console.error('트레이너 로딩 실패:', error);
      // 임시 데이터
      setTrainers([
        {
          id: 1,
          name: "김철수",
          specialization: "다이어트",
          experience: 5,
          rating: 4.8,
          price: 80000,
          gym: "강남 피트니스",
          image: "trainer1.jpg"
        },
        {
          id: 2,
          name: "이영희",
          specialization: "근력운동",
          experience: 3,
          rating: 4.5,
          price: 70000,
          gym: "홍대 스포츠센터",
          image: "trainer2.jpg"
        },
        {
          id: 3,
          name: "박민수",
          specialization: "요가",
          experience: 7,
          rating: 4.9,
          price: 90000,
          gym: "잠실 피트니스",
          image: "trainer3.jpg"
        }
      ]);
    }
  };

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.gym.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !specialization || trainer.specialization === specialization;
    return matchesSearch && matchesSpecialization;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'experience':
        return b.experience - a.experience;
      case 'price':
        return a.price - b.price;
      default:
        return 0;
    }
  });

  return (
    <div className="trainer-list">
      <div className="container">
        <div className="page-header">
          <h1>트레이너</h1>
          <div className="filter-controls">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="rating">평점순</option>
              <option value="experience">경력순</option>
              <option value="price">가격순</option>
            </select>
          </div>
        </div>

        <div className="filters">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="트레이너명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary">
              <i className="fas fa-search"></i>
            </button>
          </div>
          
          <div className="specialization-filter">
            <label>전문 분야:</label>
            <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
              <option value="">전체</option>
              <option value="다이어트">다이어트</option>
              <option value="근력운동">근력운동</option>
              <option value="요가">요가</option>
              <option value="필라테스">필라테스</option>
            </select>
          </div>
        </div>

        <div className="trainer-grid">
          {filteredTrainers.map((trainer) => (
            <div key={trainer.id} className="trainer-card">
              <div className="trainer-image">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="trainer-content">
                <h3 className="trainer-name">{trainer.name}</h3>
                <p className="trainer-gym">{trainer.gym}</p>
                <div className="trainer-info">
                  <span className="trainer-specialization">{trainer.specialization}</span>
                  <span className="trainer-experience">{trainer.experience}년 경력</span>
                </div>
                <div className="trainer-rating">
                  <i className="fas fa-star"></i>
                  <span>{trainer.rating}</span>
                </div>
                <div className="trainer-price">
                  <span>1회 {trainer.price.toLocaleString()}원</span>
                </div>
                <div className="trainer-actions">
                  <Link to={`/trainers/${trainer.id}`} className="btn btn-primary">
                    상세보기
                  </Link>
                  <button className="btn btn-outline">
                    <i className="fas fa-heart"></i>
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

export default TrainerList; 