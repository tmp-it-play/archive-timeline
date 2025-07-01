import { useState, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // 즐겨찾기 목록 로드
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated, user?.id]);

  // 즐겨찾기 목록 조회
  const loadFavorites = async () => {
    if (!isAuthenticated || !user?.id) return;

    try {
      setLoading(true);
      const response = await API.get('/v1/search/favorites', {
        params: { userId: user.id }
      });
      
      if (response.data?.items) {
        const favoriteIds = response.data.items.map(item => item.id || item.restaurantId);
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('즐겨찾기 조회 실패:', error);
      // 서버 오류 시 로컬 스토리지에서 로드
      const localFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (localFavorites) {
        try {
          setFavorites(JSON.parse(localFavorites));
        } catch (parseError) {
          console.error('로컬 즐겨찾기 파싱 실패:', parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // 즐겨찾기 토글
  const toggleFavorite = async (restaurantId) => {
    if (!isAuthenticated) {
      alert('로그인이 필요한 기능입니다.\nGoogle 로그인을 해주세요.');
      return false;
    }

    if (!user?.id) {
      console.error('사용자 정보가 없습니다.');
      return false;
    }

    const isCurrentlyFavorited = favorites.includes(restaurantId);
    
    try {
      // 낙관적 업데이트 (UI 먼저 변경)
      if (isCurrentlyFavorited) {
        setFavorites(prev => prev.filter(id => id !== restaurantId));
      } else {
        setFavorites(prev => [...prev, restaurantId]);
      }

      // 서버에 요청
      const response = await API.post('/v1/search/favorite', {
        userId: user.id,
        restaurantId: restaurantId,
        isFavorited: isCurrentlyFavorited
      });

      // 서버 응답 확인
      if (response.data?.success) {
        const actuallyFavorited = response.data.favorited;
        
        // 서버 응답과 로컬 상태 동기화
        if (actuallyFavorited && !favorites.includes(restaurantId)) {
          setFavorites(prev => [...prev, restaurantId]);
        } else if (!actuallyFavorited && favorites.includes(restaurantId)) {
          setFavorites(prev => prev.filter(id => id !== restaurantId));
        }

        // 로컬 스토리지에도 저장
        const updatedFavorites = actuallyFavorited 
          ? [...favorites.filter(id => id !== restaurantId), restaurantId]
          : favorites.filter(id => id !== restaurantId);
        
        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavorites));
        
        return true;
      } else {
        throw new Error('서버 응답 실패');
      }
    } catch (error) {
      console.error('즐겨찾기 처리 실패:', error);
      
      // 실패 시 원래 상태로 롤백
      if (isCurrentlyFavorited) {
        setFavorites(prev => [...prev, restaurantId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== restaurantId));
      }
      
      // 서버 연결 실패 시 로컬 스토리지에만 저장
      try {
        const localFavorites = isCurrentlyFavorited
          ? favorites.filter(id => id !== restaurantId)
          : [...favorites, restaurantId];
        
        setFavorites(localFavorites);
        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(localFavorites));
        
        console.log('로컬에만 즐겨찾기 저장됨');
        return true;
      } catch (localError) {
        console.error('로컬 저장 실패:', localError);
        return false;
      }
    }
  };

  // 즐겨찾기 맛집 목록 조회
  const getFavoriteRestaurants = async () => {
    if (!isAuthenticated || !user?.id) {
      return [];
    }

    try {
      const response = await API.get('/v1/search/favorites', {
        params: { userId: user.id }
      });
      
      return response.data?.items || [];
    } catch (error) {
      console.error('즐겨찾기 맛집 조회 실패:', error);
      return [];
    }
  };

  // 즐겨찾기 상태 확인
  const isFavorite = (restaurantId) => {
    return favorites.includes(restaurantId);
  };

  // 즐겨찾기 개수
  const favoriteCount = favorites.length;

  // 즐겨찾기 초기화 (로그아웃 시 등)
  const clearFavorites = () => {
    setFavorites([]);
    if (user?.id) {
      localStorage.removeItem(`favorites_${user.id}`);
    }
  };

  return {
    favorites,
    loading,
    favoriteCount,
    toggleFavorite,
    getFavoriteRestaurants,
    isFavorite,
    clearFavorites,
    refreshFavorites: loadFavorites
  };
};