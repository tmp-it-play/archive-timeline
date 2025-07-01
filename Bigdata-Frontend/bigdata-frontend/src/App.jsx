import { useState, useEffect } from 'react';
import { useAuth } from './auth/useAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AuthCallback from './pages/AuthCallback';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('loading');
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // 로딩이 완료된 후 페이지 결정
    if (!loading) {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const hasToken = searchParams.has('token');

      // OAuth 콜백 처리
      if (path === '/auth/callback' || hasToken) {
        setCurrentPage('auth-callback');
      }
      // 인증되지 않은 경우 로그인 페이지로
      else if (!isAuthenticated) {
        setCurrentPage('login');
        if (path !== '/login') {
          window.history.pushState({}, '', '/login');
        }
      }
      // 인증된 경우 홈 페이지로
      else {
        setCurrentPage('home');
        if (path === '/login' || path === '/auth/callback') {
          window.history.pushState({}, '', '/');
        }
      }
    }
  }, [isAuthenticated, loading]);

  // 브라우저 뒤로가기/앞으로가기 처리
  useEffect(() => {
    const handlePopState = () => {
      if (!loading) {
        const newPath = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);

        if (newPath === '/auth/callback' || searchParams.has('token')) {
          setCurrentPage('auth-callback');
        } else if (!isAuthenticated) {
          setCurrentPage('login');
        } else {
          setCurrentPage('home');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated, loading]);

  // 로딩 중일 때 표시할 컴포넌트
  if (loading || currentPage === 'loading') {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>🍽️ 맛집지도</h2>
          <p>앱을 초기화하고 있습니다...</p>
        </div>
      </div>
    );
  }

  // 페이지별 렌더링
  const renderPage = () => {
    switch (currentPage) {
      case 'auth-callback':
        return <AuthCallback />;
      
      case 'login':
        return <LoginPage />;
      
      case 'home':
        if (isAuthenticated) {
          return <HomePage />;
        } else {
          setCurrentPage('login');
          return <LoginPage />;
        }
      
      default:
        return isAuthenticated ? <HomePage /> : <LoginPage />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;