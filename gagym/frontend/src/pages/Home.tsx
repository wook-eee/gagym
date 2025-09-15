import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

interface Gym {
  id: number;
  name: string;
  address: string;
  rating: number;
  monthlyFee: number;
  facilities: string[];
  image: string;
  distance: number;
  dailyPassPrice: number;
}

const Home: React.FC = () => {
  const [popularGyms, setPopularGyms] = useState<Gym[]>([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');

  useEffect(() => {
    loadPopularGyms();
    getCurrentLocation();
  }, []);

  const loadPopularGyms = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/gyms/popular');
      const data = await response.json();
      setPopularGyms(data);
    } catch (error) {
      console.error('인기 헬스장 로딩 실패:', error);
      // 임시 데이터
      setPopularGyms([
        {
          id: 1,
          name: "강남 피트니스",
          address: "서울 강남구 역삼동",
          rating: 4.8,
          monthlyFee: 150000,
          facilities: ["헬스기구", "샤워시설", "주차장"],
          image: "gym1.jpg",
          distance: 0.5,
          dailyPassPrice: 15000
        },
        {
          id: 2,
          name: "홍대 스포츠센터",
          address: "서울 마포구 홍대입구",
          rating: 4.5,
          monthlyFee: 120000,
          facilities: ["헬스기구", "샤워시설", "사우나"],
          image: "gym2.jpg",
          distance: 1.2,
          dailyPassPrice: 12000
        },
        {
          id: 3,
          name: "잠실 피트니스",
          address: "서울 송파구 잠실동",
          rating: 4.7,
          monthlyFee: 180000,
          facilities: ["헬스기구", "샤워시설", "주차장", "사우나"],
          image: "gym3.jpg",
          distance: 2.1,
          dailyPassPrice: 18000
        }
      ]);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
          setCurrentLocation('서울 강남구');
        }
      );
    } else {
      setCurrentLocation('서울 강남구');
    }
  };

  const handleSearch = () => {
    if (searchLocation.trim()) {
      // 검색 기능 구현
      console.log('검색 위치:', searchLocation);
    }
  };

  const handleNearbySearch = () => {
    // 현재 위치 기반 검색
    console.log('현재 위치 기반 검색:', currentLocation);
  };

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>내 주변 헬스장을 찾아보세요</h1>
          <p>일일권으로 간편하게 이용하고, P.T 트레이너와 함께 목표를 달성하세요!</p>
          <div className="search-container">
            <div className="search-box">
              <input 
                type="text" 
                placeholder="지역명을 입력하세요"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn btn-primary" onClick={handleSearch}>
                <i className="fas fa-search"></i> 검색
              </button>
            </div>
            <button className="btn btn-outline" onClick={handleNearbySearch}>
              <i className="fas fa-map-marker-alt"></i> 내 주변 검색
            </button>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>다짐의 특별한 기능</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-map-marker-alt"></i>
            <h3>내 주변 운동시설</h3>
            <p>GPS 기반으로 가까운 헬스장을 찾아보세요</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-qrcode"></i>
            <h3>일일권 QR 결제</h3>
            <p>QR코드로 간편하게 일일권을 구매하고 이용하세요</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-dollar-sign"></i>
            <h3>최저가 할인</h3>
            <p>다짐에서만 받을 수 있는 특별한 할인 혜택</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-user-tie"></i>
            <h3>P.T 가격 비교</h3>
            <p>트레이너별 P.T 가격을 비교하고 선택하세요</p>
          </div>
        </div>
      </div>

      <div className="popular-gyms-section">
        <div className="section-header">
          <h2>인기 헬스장</h2>
          <Link to="/gyms" className="btn btn-outline">더보기</Link>
        </div>
        <div className="gym-grid">
          {popularGyms.map((gym) => (
            <div key={gym.id} className="gym-card">
              <div className="gym-image">
                <i className="fas fa-dumbbell"></i>
                <div className="gym-badge">
                  <span className="distance">{gym.distance}km</span>
                </div>
              </div>
              <div className="gym-content">
                <h3 className="gym-title">{gym.name}</h3>
                <p className="gym-address">{gym.address}</p>
                <div className="gym-info">
                  <div className="gym-rating">
                    <i className="fas fa-star"></i>
                    <span>{gym.rating}</span>
                  </div>
                  <div className="gym-price">
                    <span className="daily-price">일일권 {gym.dailyPassPrice.toLocaleString()}원</span>
                    <span className="monthly-price">월 {gym.monthlyFee.toLocaleString()}원</span>
                  </div>
                </div>
                <div className="gym-facilities">
                  {gym.facilities.slice(0, 2).map(facility => (
                    <span key={facility} className="facility-tag">{facility}</span>
                  ))}
                </div>
                <div className="gym-actions">
                  <Link to={`/gyms/${gym.id}`} className="btn btn-primary">
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

      <div className="quick-actions">
        <div className="action-card">
          <i className="fas fa-search"></i>
          <h3>헬스장 찾기</h3>
          <p>내 주변 헬스장을 검색하고 비교해보세요</p>
          <Link to="/gyms" className="btn btn-primary">검색하기</Link>
        </div>
        <div className="action-card">
          <i className="fas fa-user-tie"></i>
          <h3>P.T 트레이너</h3>
          <p>전문 트레이너와 함께 목표를 달성하세요</p>
          <Link to="/trainers" className="btn btn-primary">트레이너 찾기</Link>
        </div>
        <div className="action-card">
          <i className="fas fa-ticket-alt"></i>
          <h3>일일권 구매</h3>
          <p>간편하게 일일권을 구매하고 이용하세요</p>
          <Link to="/tickets" className="btn btn-primary">구매하기</Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 