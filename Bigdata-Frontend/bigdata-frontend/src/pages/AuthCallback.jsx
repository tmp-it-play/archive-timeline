import { useState, useEffect } from 'react';
import './AuthCallback.css';

const AuthCallback = () => {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('인증을 처리하고 있습니다...');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        // 에러가 있는 경우
        if (error) {
          setStatus('error');
          setMessage(`인증 중 오류가 발생했습니다: ${decodeURIComponent(error)}`);
          
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
          return;
        }

        // 토큰이 없는 경우
        if (!token) {
          setStatus('error');
          setMessage('인증 토큰을 받지 못했습니다.');
          
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
          return;
        }

        // JWT 토큰 저장 및 사용자 정보 추출
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length !== 3) {
            throw new Error('Invalid JWT token format');
          }

          const payload = JSON.parse(atob(tokenParts[1]));
          
          const user = {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            authorities: payload.authorities
          };

          // 토큰과 사용자 정보 저장
          localStorage.setItem('accessToken', token);
          localStorage.setItem('currentUser', JSON.stringify(user));

          setStatus('success');
          setMessage('로그인이 완료되었습니다. 잠시 후 메인 페이지로 이동합니다.');
          
          // 메인 페이지로 리다이렉트
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          
        } catch (tokenError) {
          setStatus('error');
          setMessage('인증 토큰 처리 중 오류가 발생했습니다.');
          
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        }

      } catch (error) {
        setStatus('error');
        setMessage('인증 처리 중 예상치 못한 오류가 발생했습니다.');
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    };

    processCallback();
  }, []);

  return (
    <div className="auth-callback-page">
      <div className="callback-container">
        <div className="callback-content">
          {/* 로딩 애니메이션 */}
          {status === 'processing' && (
            <div className="processing-state">
              <div className="spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
              </div>
              <h2>인증 처리 중</h2>
              <p>{message}</p>
            </div>
          )}

          {/* 성공 상태 */}
          {status === 'success' && (
            <div className="success-state">
              <div className="success-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
                  <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>로그인 성공!</h2>
              <p>{message}</p>
            </div>
          )}

          {/* 에러 상태 */}
          {status === 'error' && (
            <div className="error-state">
              <div className="error-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#F44336"/>
                  <path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>인증 실패</h2>
              <p>{message}</p>
              <div className="error-actions">
                <button 
                  className="retry-btn"
                  onClick={() => window.location.href = '/login'}
                >
                  다시 시도하기
                </button>
                <button 
                  className="home-btn"
                  onClick={() => window.location.href = '/'}
                >
                  홈으로 가기
                </button>
              </div>
            </div>
          )}

          {/* 앱 로고 */}
          <div className="app-info">
            <h3>🍽️ 맛집지도</h3>
            <p>내 취향으로 나만의 맛집지도를 만들다</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;