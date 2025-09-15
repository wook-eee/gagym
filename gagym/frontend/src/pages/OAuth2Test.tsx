import React from 'react';
import './OAuth2Test.css';

const OAuth2Test: React.FC = () => {
  const testOAuth2 = (provider: string) => {
    console.log(`Testing ${provider} OAuth2...`);
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <div className="oauth2-test">
      <div className="test-container">
        <h1>OAuth2 소셜 로그인 테스트</h1>
        <p>각 버튼을 클릭하여 소셜 로그인을 테스트해보세요.</p>
        
        <div className="test-buttons">
          <button 
            className="test-btn google"
            onClick={() => testOAuth2('google')}
          >
            구글 로그인 테스트
          </button>
          
          <button 
            className="test-btn kakao"
            onClick={() => testOAuth2('kakao')}
          >
            카카오 로그인 테스트
          </button>
          
          <button 
            className="test-btn naver"
            onClick={() => testOAuth2('naver')}
          >
            네이버 로그인 테스트
          </button>
        </div>
        
        <div className="test-info">
          <h3>테스트 방법:</h3>
          <ol>
            <li>위의 버튼 중 하나를 클릭합니다.</li>
            <li>OAuth2 제공자(구글/카카오/네이버)에서 인증을 완료합니다.</li>
            <li>성공 시 자동으로 홈페이지로 리다이렉트됩니다.</li>
            <li>실패 시 에러 페이지가 표시됩니다.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default OAuth2Test; 