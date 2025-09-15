import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './OAuth2Success.css';

const OAuth2Success: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const handleOAuth2Success = async () => {
      try {
        console.log('Attempting to fetch OAuth2 user data...');
        
        // OAuth2 사용자 정보 가져오기
        const response = await fetch('http://localhost:8080/api/oauth2/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (response.ok) {
          const data = await response.json();
          console.log('OAuth2 user data:', data);
          setUserData(data);
          
          // JWT 토큰 저장
          if (data.token) {
            localStorage.setItem('token', data.token);
            console.log('JWT token saved');
          }

          Swal.fire({
            icon: 'success',
            title: '소셜 로그인 성공!',
            text: `${data.nickname}님 환영합니다!`,
            confirmButtonColor: '#667eea',
            confirmButtonText: '확인'
          }).then(() => {
            navigate('/');
          });
        } else {
          const errorText = await response.text();
          console.error('OAuth2 API error:', errorText);
          throw new Error(`OAuth2 사용자 정보를 가져올 수 없습니다. Status: ${response.status}`);
        }
      } catch (error) {
        console.error('OAuth2 처리 실패:', error);
        
        // 재시도 로직 (최대 3번)
        if (retryCount < 3) {
          console.log(`Retrying... (${retryCount + 1}/3)`);
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            handleOAuth2Success();
          }, 2000); // 2초 후 재시도
          return;
        }
        
        Swal.fire({
          icon: 'error',
          title: '소셜 로그인 실패',
          text: '소셜 로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
          confirmButtonColor: '#667eea',
          confirmButtonText: '확인'
        }).then(() => {
          navigate('/');
        });
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuth2Success();
  }, [navigate, retryCount]);

  if (isLoading) {
    return (
      <div className="oauth2-loading">
        <div className="loading-spinner"></div>
        <p>소셜 로그인 처리 중...</p>
        {retryCount > 0 && <p>재시도 중... ({retryCount}/3)</p>}
      </div>
    );
  }

  return (
    <div className="oauth2-success">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>소셜 로그인 성공!</h1>
        {userData && (
          <div className="user-info">
            <p>환영합니다, {userData.nickname}님!</p>
            <p>이메일: {userData.email}</p>
          </div>
        )}
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/')}
        >
          홈으로 이동
        </button>
      </div>
    </div>
  );
};

export default OAuth2Success; 