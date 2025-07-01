import { useAuth } from '../auth/useAuth';
import './BottomNavigation.css';

const BottomNavigation = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      // 로그인된 상태: 프로필 메뉴 표시 또는 마이페이지로 이동
      const shouldLogout = window.confirm(`${user?.name || '사용자'}님, 로그아웃 하시겠습니까?`);
      if (shouldLogout) {
        logout();
      }
    } else {
      // 로그인되지 않은 상태: 로그인 페이지로 이동
      window.location.href = '/login';
    }
  };

  return (
    <div className="bottom-navigation">
      <div className="nav-item">
        <div className="nav-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="nav-label">맛집지도</span>
      </div>
      
      <div className="nav-item active">
        <div className="nav-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="nav-label">홈</span>
      </div>
      
      <div className="nav-item" onClick={handleProfileClick}>
        <div className="nav-icon">
          {isAuthenticated ? (
            // 로그인된 상태: 사용자 아바타 또는 프로필 아이콘
            <div className="user-avatar">
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt="프로필" 
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-initial">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
          ) : (
            // 로그인되지 않은 상태: 일반 사용자 아이콘
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <span className="nav-label">
          {isAuthenticated ? (user?.name || '마이페이지') : '로그인'}
        </span>
      </div>
    </div>
  );
};

export default BottomNavigation;