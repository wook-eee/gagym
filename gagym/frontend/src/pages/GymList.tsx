import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './GymList.css';

interface Gym {
  id: number;
  name: string;
  address: string;
  rating: number;
  monthlyFee: number;
  facilities: string[];
  distance: number;
  image: string;
}

const GymList: React.FC = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [filteredGyms, setFilteredGyms] = useState<Gym[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  useEffect(() => {
    loadGyms();
  }, []);

  useEffect(() => {
    filterAndSortGyms();
  }, [gyms, searchTerm, sortBy, priceRange, selectedFacilities]);

  const loadGyms = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/gyms');
      const data = await response.json();
      setGyms(data);
    } catch (error) {
      console.error('헬스장 로딩 실패:', error);
      // 임시 데이터
      setGyms([
        {
          id: 1,
          name: "강남 피트니스",
          address: "서울 강남구 역삼동",
          rating: 4.8,
          monthlyFee: 150000,
          facilities: ["헬스기구", "샤워시설", "주차장"],
          distance: 0.5,
          image: "gym1.jpg"
        },
        {
          id: 2,
          name: "홍대 스포츠센터",
          address: "서울 마포구 홍대입구",
          rating: 4.5,
          monthlyFee: 120000,
          facilities: ["헬스기구", "샤워시설", "사우나"],
          distance: 1.2,
          image: "gym2.jpg"
        },
        {
          id: 3,
          name: "잠실 피트니스",
          address: "서울 송파구 잠실동",
          rating: 4.7,
          monthlyFee: 180000,
          facilities: ["헬스기구", "샤워시설", "주차장", "사우나"],
          distance: 2.1,
          image: "gym3.jpg"
        }
      ]);
    }
  };

  const filterAndSortGyms = () => {
    let filtered = gyms.filter(gym => {
      const matchesSearch = gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          gym.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = gym.monthlyFee >= priceRange.min && gym.monthlyFee <= priceRange.max;
      const matchesFacilities = selectedFacilities.length === 0 ||
                              selectedFacilities.some(facility => gym.facilities.includes(facility));
      
      return matchesSearch && matchesPrice && matchesFacilities;
    });

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.monthlyFee - b.monthlyFee;
        default:
          return 0;
      }
    });

    setFilteredGyms(filtered);
  };

  const handleFacilityToggle = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility) 
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
  };

  return (
    <div className="gym-list">
      <div className="container">
        <div className="page-header">
          <h1>헬스장 목록</h1>
          <div className="filter-controls">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="distance">거리순</option>
              <option value="rating">평점순</option>
              <option value="price">가격순</option>
            </select>
            <button className="btn btn-outline">
              <i className="fas fa-map"></i> 지도보기
            </button>
          </div>
        </div>

        <div className="filters">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="헬스장명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary">
              <i className="fas fa-search"></i>
            </button>
          </div>
          
          <div className="filter-options">
            <div className="price-filter">
              <label>가격 범위:</label>
              <input 
                type="range" 
                min="0" 
                max="200000" 
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
              />
              <span>{priceRange.min.toLocaleString()}원</span>
              <span>-</span>
              <input 
                type="range" 
                min="0" 
                max="200000" 
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
              />
              <span>{priceRange.max.toLocaleString()}원</span>
            </div>
            
            <div className="facility-filter">
              <label>시설:</label>
              {["헬스기구", "샤워시설", "주차장", "사우나"].map(facility => (
                <label key={facility} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    value={facility}
                    checked={selectedFacilities.includes(facility)}
                    onChange={() => handleFacilityToggle(facility)}
                  />
                  {facility}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="gym-grid">
          {filteredGyms.map((gym) => (
            <div key={gym.id} className="gym-card">
              <div className="gym-image">
                <i className="fas fa-dumbbell"></i>
              </div>
              <div className="gym-content">
                <h3 className="gym-title">{gym.name}</h3>
                <p className="gym-address">{gym.address}</p>
                <div className="gym-info">
                  <span className="gym-price">월 {gym.monthlyFee.toLocaleString()}원</span>
                  <div className="gym-rating">
                    <i className="fas fa-star"></i>
                    <span>{gym.rating}</span>
                  </div>
                  <span className="gym-distance">{gym.distance}km</span>
                </div>
                <div className="gym-facilities">
                  {gym.facilities.slice(0, 3).map(facility => (
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
    </div>
  );
};

export default GymList; 