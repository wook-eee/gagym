import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    email: '',
    nickname: '',
    address: ''
  });
  const [emailVerification, setEmailVerification] = useState({
    email: '',
    code: '',
    isVerified: false,
    isCodeSent: false
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm)
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setShowLoginModal(false);
        Swal.fire({
          icon: 'success',
          title: '로그인 성공!',
          text: '환영합니다!',
          confirmButtonColor: '#667eea',
          confirmButtonText: '확인'
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '로그인 실패',
          text: '아이디와 비밀번호를 확인해주세요.',
          confirmButtonColor: '#667eea',
          confirmButtonText: '확인'
        });
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      Swal.fire({
        icon: 'error',
        title: '로그인 실패',
        text: '서버 연결에 문제가 있습니다. 다시 시도해주세요.',
        confirmButtonColor: '#667eea',
        confirmButtonText: '확인'
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.passwordConfirm) {
      Swal.fire({
        icon: 'error',
        title: '비밀번호 불일치',
        text: '비밀번호가 일치하지 않습니다.',
        confirmButtonColor: '#667eea',
        confirmButtonText: '확인'
      });
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupForm)
      });
      
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '회원가입 완료!',
          text: '회원가입이 성공적으로 완료되었습니다.',
          confirmButtonColor: '#667eea',
          confirmButtonText: '확인'
        }).then(() => {
          setShowSignupModal(false);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '회원가입 실패',
          text: '회원가입에 실패했습니다. 다시 시도해주세요.',
          confirmButtonColor: '#667eea',
          confirmButtonText: '확인'
        });
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      Swal.fire({
        icon: 'error',
        title: '회원가입 실패',
        text: '서버 연결에 문제가 있습니다. 다시 시도해주세요.',
        confirmButtonColor: '#667eea',
        confirmButtonText: '확인'
      });
    }
  };

  const sendVerificationEmail = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailVerification.email })
      });
      
      if (response.ok) {
        setEmailVerification(prev => ({ ...prev, isCodeSent: true }));
        Swal.fire({
          icon: 'success',
          title: '인증 코드 발송',
          text: '인증 코드가 이메일로 발송되었습니다.',
          confirmButtonColor: '#667eea',
          confirmButtonText: '확인'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '인증 코드 발송 실패',
          text: '인증 코드 발송에 실패했습니다. 다시 시도해주세요.',
          confirmButtonColor: '#667eea',
          confirmButtonText: '확인'
        });
      }
    } catch (error) {
      console.error('인증 코드 발송 실패:', error);
      Swal.fire({
        icon: 'error',
        title: '인증 코드 발송 실패',
        text: '서버 연결에 문제가 있습니다. 다시 시도해주세요.',
        confirmButtonColor: '#667eea',
        confirmButtonText: '확인'
      });
    }
  };

  const verifyEmail = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailVerification.email,
          code: emailVerification.code
        })
      });
      
      if (response.ok) {
        setEmailVerification(prev => ({ ...prev, isVerified: true }));
        Swal.fire({
          icon: 'success',
          title: '이메일 인증 완료',
          text: '이메일 인증이 성공적으로 완료되었습니다.',
          confirmButtonColor: '#667eea',
          confirmButtonText: '확인'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '인증 실패',
          text: '인증 코드가 올바르지 않습니다. 다시 확인해주세요.',
          confirmButtonColor: '#667eea',
          confirmButtonText: '확인'
        });
      }
    } catch (error) {
      console.error('이메일 인증 실패:', error);
      Swal.fire({
        icon: 'error',
        title: '이메일 인증 실패',
        text: '서버 연결에 문제가 있습니다. 다시 시도해주세요.',
        confirmButtonColor: '#667eea',
        confirmButtonText: '확인'
      });
    }
  };

  const socialLogin = (provider: string) => {
    // 소셜 로그인 구현
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <div className="logo-icon">다</div>
            <span>다짐</span>
          </Link>
          <nav className="nav-menu">
            <div className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                홈
              </Link>
            </div>
            <div className="nav-item">
              <Link 
                to="/gyms" 
                className={`nav-link ${location.pathname === '/gyms' ? 'active' : ''}`}
              >
                헬스장
              </Link>
            </div>
            <div className="nav-item">
              <Link 
                to="/trainers" 
                className={`nav-link ${location.pathname === '/trainers' ? 'active' : ''}`}
              >
                트레이너
              </Link>
            </div>
            <div className="nav-item">
              <Link 
                to="/tickets" 
                className={`nav-link ${location.pathname === '/tickets' ? 'active' : ''}`}
              >
                일일권
              </Link>
            </div>
            <div className="nav-item">
              <Link 
                to="/mypage" 
                className={`nav-link ${location.pathname === '/mypage' ? 'active' : ''}`}
              >
                마이페이지
              </Link>
            </div>
          </nav>
          <div className="auth-buttons">
            <button className="btn btn-outline" onClick={() => setShowLoginModal(true)}>
              로그인
            </button>
            <button className="btn btn-primary" onClick={() => setShowSignupModal(true)}>
              회원가입
            </button>
          </div>
        </div>
      </header>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">로그인</h2>
              <button className="close-btn" onClick={() => setShowLoginModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>아이디</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>비밀번호</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary btn-full">로그인</button>
              </div>
            </form>
            
            <div className="social-login">
              <h3>소셜 계정으로 로그인</h3>
              <div className="social-buttons">
                <button type="button" className="social-btn google" onClick={() => socialLogin('google')}>
                  <i className="fab fa-google"></i> 구글로 로그인
                </button>
                <button type="button" className="social-btn kakao" onClick={() => socialLogin('kakao')}>
                  <i className="fas fa-comment"></i> 카카오로 로그인
                </button>
                <button type="button" className="social-btn naver" onClick={() => socialLogin('naver')}>
                  <i className="fas fa-n"></i> 네이버로 로그인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 회원가입 모달 */}
      {showSignupModal && (
        <div className="modal-overlay" onClick={() => setShowSignupModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">회원가입</h2>
              <button className="close-btn" onClick={() => setShowSignupModal(false)}>&times;</button>
            </div>
            
            {/* 이메일 인증 단계 */}
            <div className="verification-section">
              <div className="form-group">
                <label>이메일</label>
                <div className="verification-row">
                  <input
                    type="email"
                    value={emailVerification.email}
                    onChange={(e) => setEmailVerification({ ...emailVerification, email: e.target.value })}
                    required
                  />
                  <button type="button" className="verification-btn" onClick={sendVerificationEmail}>
                    인증코드 발송
                  </button>
                </div>
              </div>
              
              {emailVerification.isCodeSent && (
                <div className="form-group">
                  <label>인증 코드</label>
                  <div className="verification-row">
                    <input
                      type="text"
                      value={emailVerification.code}
                      onChange={(e) => setEmailVerification({ ...emailVerification, code: e.target.value })}
                      placeholder="6자리 코드 입력"
                      maxLength={6}
                    />
                    <button type="button" className="verification-btn" onClick={verifyEmail}>
                      인증 확인
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* 회원가입 폼 */}
            <form onSubmit={handleSignup}>
              <div className="form-row">
                <div className="form-group">
                  <label>아이디</label>
                  <input
                    type="text"
                    value={signupForm.username}
                    onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>닉네임</label>
                  <input
                    type="text"
                    value={signupForm.nickname}
                    onChange={(e) => setSignupForm({ ...signupForm, nickname: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>비밀번호</label>
                <input
                  type="password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>비밀번호 확인</label>
                <input
                  type="password"
                  value={signupForm.passwordConfirm}
                  onChange={(e) => setSignupForm({ ...signupForm, passwordConfirm: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>주소</label>
                <input
                  type="text"
                  value={signupForm.address}
                  onChange={(e) => setSignupForm({ ...signupForm, address: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary btn-full">회원가입</button>
              </div>
            </form>
            
            <div className="social-login">
              <h3>소셜 계정으로 회원가입</h3>
              <div className="social-buttons">
                <button type="button" className="social-btn google" onClick={() => socialLogin('google')}>
                  <i className="fab fa-google"></i> 구글로 가입
                </button>
                <button type="button" className="social-btn kakao" onClick={() => socialLogin('kakao')}>
                  <i className="fas fa-comment"></i> 카카오로 가입
                </button>
                <button type="button" className="social-btn naver" onClick={() => socialLogin('naver')}>
                  <i className="fas fa-n"></i> 네이버로 가입
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header; 