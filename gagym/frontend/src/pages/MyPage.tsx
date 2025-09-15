import React, { useState, useEffect } from 'react';
import './MyPage.css';

interface User {
  id: number;
  name: string;
  email: string;
  profileImage: string;
}

interface Ticket {
  id: number;
  name: string;
  gym: string;
  purchaseDate: string;
  expiryDate: string;
  status: string;
}

interface Purchase {
  id: number;
  itemName: string;
  price: number;
  purchaseDate: string;
  status: string;
}

const MyPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [myPurchases, setMyPurchases] = useState<Purchase[]>([]);
  const [myFavorites, setMyFavorites] = useState<any[]>([]);

  useEffect(() => {
    loadUserData();
    loadMyTickets();
    loadMyPurchases();
    loadMyFavorites();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/me');
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('사용자 정보 로딩 실패:', error);
      // 임시 데이터
      setUser({
        id: 1,
        name: "홍길동",
        email: "hong@example.com",
        profileImage: "profile.jpg"
      });
    }
  };

  const loadMyTickets = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/me/tickets');
      const data = await response.json();
      setMyTickets(data);
    } catch (error) {
      console.error('내 티켓 로딩 실패:', error);
      // 임시 데이터
      setMyTickets([
        {
          id: 1,
          name: "일일 이용권",
          gym: "강남 피트니스",
          purchaseDate: "2024-01-15",
          expiryDate: "2024-01-16",
          status: "사용 가능"
        }
      ]);
    }
  };

  const loadMyPurchases = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/me/purchases');
      const data = await response.json();
      setMyPurchases(data);
    } catch (error) {
      console.error('구매 내역 로딩 실패:', error);
      // 임시 데이터
      setMyPurchases([
        {
          id: 1,
          itemName: "일일 이용권",
          price: 15000,
          purchaseDate: "2024-01-15",
          status: "완료"
        }
      ]);
    }
  };

  const loadMyFavorites = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/me/favorites');
      const data = await response.json();
      setMyFavorites(data);
    } catch (error) {
      console.error('찜한 헬스장 로딩 실패:', error);
      // 임시 데이터
      setMyFavorites([
        {
          id: 1,
          name: "강남 피트니스",
          address: "서울 강남구 역삼동",
          rating: 4.8
        }
      ]);
    }
  };

  if (!user) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="mypage">
      <div className="container">
        <div className="page-header">
          <h1>마이페이지</h1>
        </div>

        <div className="mypage-content">
          <div className="user-info">
            <h2>회원 정보</h2>
            <div className="user-details">
              <div className="user-profile">
                <div className="profile-image">
                  <i className="fas fa-user"></i>
                </div>
                <div className="profile-info">
                  <p><strong>이름:</strong> {user.name}</p>
                  <p><strong>이메일:</strong> {user.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="my-tickets">
            <h2>내 티켓</h2>
            <div className="ticket-list">
              {myTickets.map((ticket) => (
                <div key={ticket.id} className="ticket-item">
                  <div className="ticket-info">
                    <h3>{ticket.name}</h3>
                    <p>{ticket.gym}</p>
                    <p>구매일: {ticket.purchaseDate}</p>
                    <p>만료일: {ticket.expiryDate}</p>
                  </div>
                  <div className="ticket-status">
                    <span className={`status ${ticket.status === '사용 가능' ? 'active' : 'expired'}`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="my-favorites">
            <h2>찜한 헬스장</h2>
            <div className="favorite-list">
              {myFavorites.map((favorite) => (
                <div key={favorite.id} className="favorite-item">
                  <div className="favorite-info">
                    <h3>{favorite.name}</h3>
                    <p>{favorite.address}</p>
                    <div className="favorite-rating">
                      <i className="fas fa-star"></i>
                      <span>{favorite.rating}</span>
                    </div>
                  </div>
                  <button className="btn btn-outline">
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="my-purchases">
            <h2>구매 내역</h2>
            <div className="purchase-list">
              {myPurchases.map((purchase) => (
                <div key={purchase.id} className="purchase-item">
                  <div className="purchase-info">
                    <h3>{purchase.itemName}</h3>
                    <p>구매일: {purchase.purchaseDate}</p>
                    <p>가격: {purchase.price.toLocaleString()}원</p>
                  </div>
                  <div className="purchase-status">
                    <span className={`status ${purchase.status === '완료' ? 'completed' : 'pending'}`}>
                      {purchase.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage; 