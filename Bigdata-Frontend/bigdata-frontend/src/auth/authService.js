import axios from 'axios';

// 인증 API 클라이언트 (프록시 사용)
const AUTH_API = axios.create({
  baseURL: '/api/auth', // 프록시를 통해 호출
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 요청 인터셉터 - Authorization 헤더 추가
AUTH_API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 처리
AUTH_API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시에만 로그아웃 처리 (초기 인증 검증 시에는 제외)
      if (!error.config?.url?.includes('/user')) {
        authService.logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// 인증 서비스 클래스
class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.listeners = [];
    
    // 페이지 로드 시 토큰 확인
    this.initializeAuth();
  }

  // 인증 상태 초기화
  initializeAuth() {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('currentUser');
    
    if (token && userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
        this.isAuthenticated = true;
        this.notifyListeners();
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        this.clearAuthData();
      }
    }
  }

  // Google OAuth 로그인 URL 생성
  getGoogleLoginUrl() {
    return '/oauth2/authorization/google';
  }

  // 사용자 정보 조회 (JWT 토큰 사용) - 실패해도 로그아웃하지 않음
  async getCurrentUser() {
    try {
      const response = await AUTH_API.get('/user');
      
      if (response.data.success && response.data.data) {
        const user = response.data.data;
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.notifyListeners();
        return user;
      } else {
        // API 응답이 실패해도 기존 토큰 유지
        return this.currentUser;
      }
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error);
      // 네트워크 오류나 서버 오류의 경우 기존 인증 상태 유지
      return this.currentUser;
    }
  }

  // 로그아웃
  async logout() {
    try {
      await AUTH_API.post('/logout');
    } catch (error) {
      console.warn('서버 로그아웃 요청 실패:', error);
    }

    this.clearAuthData();
  }

  // 인증 데이터 설정
  setAuthData(accessToken, user, refreshToken = null) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    this.currentUser = user;
    this.isAuthenticated = true;
    this.notifyListeners();
  }

  // 인증 데이터 정리
  clearAuthData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');

    this.currentUser = null;
    this.isAuthenticated = false;
    this.notifyListeners();
  }

  // 인증 상태 변경 리스너 등록
  addAuthListener(callback) {
    this.listeners.push(callback);
    
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // 리스너들에게 인증 상태 변경 알림
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback({
          isAuthenticated: this.isAuthenticated,
          user: this.currentUser
        });
      } catch (error) {
        console.error('인증 리스너 호출 오류:', error);
      }
    });
  }

  // 현재 사용자 정보 반환
  getUser() {
    return this.currentUser;
  }

  // 인증 상태 확인
  isLoggedIn() {
    return this.isAuthenticated && !!this.currentUser;
  }

  // 토큰 유효성 검사 - 실패해도 로그아웃하지 않음
  async validateToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return false;
    }

    // 토큰이 있으면 일단 유효하다고 가정 (서버 검증은 필요시에만)
    return true;
  }

  // JWT 토큰 디코드
  decodeJWTToken(token) {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid JWT token format');
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      return payload;
    } catch (error) {
      console.error('JWT 토큰 디코드 오류:', error);
      return null;
    }
  }

  // 토큰 만료 확인
  isTokenExpired(token) {
    try {
      const payload = this.decodeJWTToken(token);
      if (!payload || !payload.exp) {
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // 사용하지 않는 메서드들
  async login(email, password) {
    return { 
      success: false, 
      error: '현재 Google 로그인만 지원합니다. Google 로그인 버튼을 사용해주세요.' 
    };
  }

  async signup(email, password, name) {
    return { 
      success: false, 
      error: '현재 Google 로그인만 지원합니다. Google 로그인 버튼을 사용해주세요.' 
    };
  }

  async handleOAuthCallback(code, state) {
    return { 
      success: false, 
      error: 'OAuth 콜백은 백엔드에서 처리됩니다.' 
    };
  }

  async refreshToken() {
    this.logout();
    return null;
  }
}

// 싱글톤 인스턴스 생성
const authService = new AuthService();

export default authService;