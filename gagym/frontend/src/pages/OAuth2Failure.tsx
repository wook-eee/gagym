import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './OAuth2Failure.css';

const OAuth2Failure: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    Swal.fire({
      icon: 'error',
      title: '소셜 로그인 실패',
      text: '소셜 로그인에 실패했습니다. 다시 시도해주세요.',
      confirmButtonColor: '#667eea',
      confirmButtonText: '확인'
    }).then(() => {
      navigate('/');
    });
  }, [navigate]);

  return (
    <div className="oauth2-failure">
      <div className="failure-container">
        <div className="failure-icon">✗</div>
        <h1>소셜 로그인 실패</h1>
        <p>소셜 로그인 처리 중 오류가 발생했습니다.</p>
        <p>다시 시도해주세요.</p>
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

export default OAuth2Failure; 