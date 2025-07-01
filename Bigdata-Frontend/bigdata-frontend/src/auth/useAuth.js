import { useState, useEffect } from 'react';
import authService from './authService';

// 인증 상태를 관리하는 커스텀 훅
export const useAuth = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: authService.isLoggedIn(),
    user: authService.getUser(),
    loading: true
  });

  useEffect(() => {
    let isMounted = true;

    // 초기 토큰 검증 - 서버 호출 없이 로컬 상태만 확인
    const validateInitialAuth = async () => {
      try {
        // 토큰이 있으면 유효하다고 가정 (서버 검증 제거)
        const hasValidToken = authService.isLoggedIn();
        
        if (isMounted) {
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: hasValidToken,
            user: authService.getUser(),
            loading: false
          }));
        }
      } catch (error) {
        console.error('초기 인증 검증 오류:', error);
        if (isMounted) {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    // 인증 상태 리스너 등록
    const removeAuthListener = authService.addAuthListener((newAuthState) => {
      if (isMounted) {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: newAuthState.isAuthenticated,
          user: newAuthState.user,
          loading: false
        }));
      }
    });

    validateInitialAuth();
    
    return () => {
      isMounted = false;
      removeAuthListener();
    };
  }, []);

  // Google 로그인 함수
  const loginWithGoogle = () => {
    const googleLoginUrl = authService.getGoogleLoginUrl();
    window.location.href = googleLoginUrl;
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
      authService.clearAuthData();
    }
  };

  // 사용하지 않는 함수들
  const login = async (email, password) => {
    return authService.login(email, password);
  };

  const signup = async (email, password, name) => {
    return authService.signup(email, password, name);
  };

  const handleOAuthCallback = async (code, state) => {
    return authService.handleOAuthCallback(code, state);
  };

  return {
    ...authState,
    login,
    signup,
    loginWithGoogle,
    logout,
    handleOAuthCallback
  };
};