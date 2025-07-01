import { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });
  const [error, setError] = useState('');

  const { loginWithGoogle, loading } = useAuth();

  // 입력 필드 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 일반 로그인 처리 (실제로는 구현되지 않음)
  const handleLogin = async () => {
    setError('');

    if (!formData.id || !formData.password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    // 일반 로그인은 구현되지 않았으므로 Google 로그인으로 안내
    setError('현재 Google 로그인만 지원합니다. 아래 Google 로그인 버튼을 사용해주세요.');
  };

  // Google 로그인 처리
  const handleGoogleLogin = () => {
    try {
      loginWithGoogle();
    } catch (error) {
      console.error('Google 로그인 오류:', error);
      setError('Google 로그인 중 오류가 발생했습니다.');
    }
  };

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      {/* Status Bar */}
      <div className="status-bar">
        <span className="time">12:45</span>
        <div className="status-icons">
          <div className="icon-wifi"></div>
          <div className="icon-signal"></div>
          <div className="icon-battery"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="login-content">
        {/* Welcome Message */}
        <div className="welcome-section">
          <h1 className="welcome-title">
            안녕하세요:)<br />
            오늘도 나의 맛집을 찾아볼까요?
          </h1>
        </div>

        {/* Login Form */}
        <div className="form-container">
          {/* ID Input */}
          <div className="input-group">
            <label className="input-label">아이디</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="아이디를 입력해주세요"
              className="form-input"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label className="input-label">비밀번호</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="비밀번호를 입력해주세요"
              className="form-input"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Social Login Section */}
          <div className="social-login-section">
            <p className="social-login-title">소셜 로그인</p>
            <div className="social-buttons">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="social-button google-button"
                aria-label="Google로 로그인"
              >
                <svg className="social-icon" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="login-button"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          {/* Signup Link */}
          <div className="signup-section">
            <p className="signup-text">
              아직 앞까지 없안다고? 
              <span className="signup-link">회원가입하기</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Placeholder */}
      <div className="bottom-nav-placeholder">
        <div className="nav-item"></div>
        <div className="nav-item nav-item-active"></div>
        <div className="nav-item"></div>
      </div>
    </div>
  );
};

export default LoginPage;