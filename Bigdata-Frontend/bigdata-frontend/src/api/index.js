import axios from 'axios';

// API 기본 설정 (프록시 사용)
const API = axios.create({
  baseURL: '/api', // 프록시를 통해 호출
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 응답 인터셉터 - 에러 로깅 및 처리
API.interceptors.response.use(
  response => response,
  error => {
    console.error('API 요청 실패:', error);
    return Promise.reject(error);
  }
);

export const searchRestaurants = async (query, category = null, minRating = null, location = null, sortBy = 'relevance') => {
  try {
    let params = {
      type: 'db'
    };

    // 검색어 처리 - view에서 넘어온 값을 그대로 사용
    if (query !== null && query !== undefined && query.toString().trim()) {
      params.q = query.toString().trim();
    }

    // 별점 필터가 있을 때만 추가
    if (minRating && minRating > 0) {
      params.minRating = minRating;
    }

    console.log('검색 API 호출:', params);
    const response = await API.get('/v1/search', { params });

    const results = response.data.items || [];
    console.log('검색 결과:', results.length, '개');

    return results.map(formatDbDataToUI);
  } catch (error) {
    console.error('검색 API 오류:', error);
    return getBackupRestaurants(query, category);
  }
};

/**
 * 근처 맛집 검색 API
 */
export const fetchNearbyRestaurants = async (location = '광주 광산구', radius = 3.0, category = null, sortBy = 'distance') => {
  try {
    let params = { 
      location, 
      sortBy 
    };
    
    if (radius) {
      params.radius = radius;
    }
    
    if (category && category !== 'all') {
      params.category = category;
    }
    
    const response = await API.get('/v1/search/nearby', { params });
    return (response.data.items || []).map(formatDbDataToUI);
  } catch (error) {
    console.error('근처 맛집 API 오류:', error);
    return getBackupNearbyRestaurants();
  }
};

/**
 * 인기 맛집 조회 API
 */
export const fetchTrendingRestaurants = async (location = '광주 광산구', limit = 10) => {
  try {
    const response = await API.get('/v1/search/trending', {
      params: { location, limit }
    });
    
    return (response.data.items || []).map(formatDbDataToUI);
  } catch (error) {
    console.error('인기 맛집 API 오류:', error);
    return getBackupTrendingRestaurants();
  }
};

/**
 * AI 키워드 추천 API
 */
export const fetchAIKeywords = async (limit = 10) => {
  try {
    const response = await API.get('/v1/search/ai/keywords', {
      params: { limit }
    });
    
    return response.data.keywords || [];
  } catch (error) {
    console.error('AI 키워드 API 오류:', error);
    return ['한식', '일식', '양식', '치킨', '피자', '카페'];
  }
};

/**
 * AI 추천 맛집 API
 */
export const fetchAIRecommendations = async (keywords) => {
  try {
    const keywordString = Array.isArray(keywords) ? keywords.join(',') : keywords;
    
    const response = await API.get('/v1/search/ai/recommend', {
      params: { keywords: keywordString }
    });
    
    const recommendations = response.data.items || [];
    // AI 추천 결과를 UI 형식으로 변환
    return recommendations.map(formatAIDataToUI);
  } catch (error) {
    console.error('AI 추천 API 오류:', error);
    return [];
  }
};

/**
 * 키워드 추천 API
 */
export const fetchKeywordRecommendations = async (keywords, limit = 10) => {
  try {
    const response = await API.get('/v1/search/recommend', {
      params: { keywords, limit }
    });
    
    return response.data;
  } catch (error) {
    console.error('키워드 추천 API 오류:', error);
    return { recommendations: [] };
  }
};

/**
 * Figma Search Controller API
 */
export const searchRestaurantsFigma = async (query) => {
  try {
    const response = await API.post('/search', { query });
    
    const results = response.data.results || [];
    return results;
  } catch (error) {
    console.error('Figma 검색 API 오류:', error);
    return [];
  }
};

/**
 * 검색 제안 API
 */
export const fetchSearchSuggestions = async (query = '') => {
  try {
    const response = await API.get('/search/suggestions', {
      params: query ? { query } : {}
    });
    
    return response.data.suggestions || [];
  } catch (error) {
    console.error('검색 제안 API 오류:', error);
    return ['짬뽕', '떡갈비', '치킨', '피자', '한식'];
  }
};

/**
 * 인기 키워드 API
 */
export const fetchPopularKeywords = async () => {
  try {
    const response = await API.get('/search/popular');
    
    return response.data.keywords || [];
  } catch (error) {
    console.error('인기 키워드 API 오류:', error);
    return ['짬뽕', '떡갈비', '치킨', '피자', '한식'];
  }
};

// =====================================
// 2. Figma 디자인 기반 섹션별 데이터
// =====================================

/**
 * "오늘의 우리동네 추천" - 근처 맛집 API 사용
 */
export const fetchRecommendedRestaurants = async () => {
  try {
    const results = await fetchNearbyRestaurants('광주 광산구', 3.0, null, 'rating');
    return results.slice(0, 3);
  } catch (error) {
    console.error('추천 맛집 조회 오류:', error);
    return getBackupRecommendedRestaurants();
  }
};

/**
 * "나의 또간집" - 인기 맛집 API 사용 (평점 높은 순)
 */
export const fetchFrequentRestaurants = async () => {
  try {
    const results = await fetchTrendingRestaurants('광주 광산구', 10);
    return results.slice(0, 3);
  } catch (error) {
    console.error('또간집 조회 오류:', error);
    return getBackupFrequentRestaurants();
  }
};

/**
 * "오늘의 블루리본 추천" - 최고 평점 맛집
 */
export const fetchBlueRibbonRestaurants = async () => {
  try {
    const results = await searchRestaurants('', null, 4.8, '광주 광산구', 'rating');
    return results.slice(0, 3).map(restaurant => ({
      ...restaurant,
      isBlueRibbon: true
    }));
  } catch (error) {
    console.error('블루리본 맛집 조회 오류:', error);
    return getBackupBlueRibbonRestaurants();
  }
};

/**
 * 카테고리 목록 - data 엔티티의 foodType 기반
 */
export const fetchFoodCategories = async () => {
  return [
    { id: 'all', name: '전체', icon: '🍽️' },
    { id: '한식', name: '한식', icon: '🍚' },
    { id: '중식', name: '중식', icon: '🍜' },
    { id: '일식', name: '일식', icon: '🍣' },
    { id: '양식', name: '양식', icon: '🍝' },
    { id: '분식', name: '분식', icon: '🍱' },
    { id: '치킨', name: '치킨', icon: '🍗' },
    { id: '피자', name: '피자', icon: '🍕' },
    { id: '햄버거', name: '햄버거', icon: '🍔' },
    { id: '카페', name: '카페', icon: '☕' },
    { id: '기타', name: '기타', icon: '🍴' }
  ];
};

// =====================================
// 3. 데이터 변환 함수들
// =====================================

/**
 * DbDataDto를 UI 컴포넌트용 데이터로 변환
 */
const formatDbDataToUI = (dbData) => {
  if (!dbData) return null;
  
  return {
    // 기본 정보
    id: dbData.id || 'N/A',
    name: dbData.bizName || 'N/A',
    
    // UI 표시용 정보
    image: generateImageUrl(dbData.bizName),
    distance: calculateDistance(dbData.roadAddr),
    location: formatLocation(dbData.jibunAddr || dbData.roadAddr),
    rating: dbData.naverRating || 0,
    reviewCount: calculateReviewCount(dbData.naverRating),
    reviewText: formatReviewText(dbData.naverRating),
    minOrder: generateMinOrder(),
    category: dbData.foodType || 'N/A',
    isBlueRibbon: (dbData.naverRating && dbData.naverRating >= 4.8),
    
    // 상세 정보
    address: dbData.roadAddr || dbData.jibunAddr || 'N/A',
    phone: dbData.phoneNum || 'N/A',
    mainFood: dbData.mainFood || 'N/A',
    permitNo: dbData.permitNo || 'N/A',
    permitType: dbData.permitType || 'N/A',
    applyDate: dbData.applyDate ? formatDate(dbData.applyDate) : 'N/A',
    designateDate: dbData.designateDate ? formatDate(dbData.designateDate) : 'N/A',
    lastUpdateDate: dbData.lastUpdateDate ? formatDateTime(dbData.lastUpdateDate) : 'N/A',
    
    // 원본 데이터
    originalData: dbData
  };
};

/**
 * AI 추천 데이터를 UI 형식으로 변환
 */
const formatAIDataToUI = (aiData) => {
  return {
    id: aiData.id || Math.random().toString(36),
    name: aiData.name || aiData.restaurant_name || 'AI 추천 맛집',
    image: generateImageUrl(aiData.name || aiData.restaurant_name),
    distance: aiData.distance || '알 수 없음',
    location: aiData.location || aiData.address || 'N/A',
    rating: aiData.rating || aiData.score || 0,
    reviewCount: aiData.reviews || 0,
    reviewText: formatReviewText(aiData.rating || aiData.score),
    minOrder: aiData.minOrder || generateMinOrder(),
    category: aiData.category || aiData.food_type || 'N/A',
    isBlueRibbon: (aiData.rating || aiData.score || 0) >= 4.8,
    address: aiData.address || 'N/A',
    phone: aiData.phone || 'N/A',
    originalData: aiData
  };
};

// =====================================
// 4. 유틸리티 함수들 (기존과 동일)
// =====================================

const generateImageUrl = (bizName) => {
  if (!bizName || bizName === 'N/A') {
    return 'https://via.placeholder.com/200x150/CCCCCC/FFFFFF?text=N%2FA';
  }
  
  const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', 'F39C12'];
  const color = colors[Math.abs(hashCode(bizName)) % colors.length];
  return `https://via.placeholder.com/200x150/${color}/FFFFFF?text=${encodeURIComponent(bizName)}`;
};

const calculateDistance = (address) => {
  if (!address || address === 'N/A') return 'N/A';
  
  if (address.includes('소촌')) return '450m';
  if (address.includes('송정')) return '650m';
  if (address.includes('광산구')) return '800m';
  
  const distances = [300, 450, 600, 750, 900, 1200];
  const randomDistance = distances[Math.floor(Math.random() * distances.length)];
  return `${randomDistance}m`;
};

const formatLocation = (address) => {
  if (!address || address === 'N/A') return 'N/A';
  
  const parts = address.split(' ');
  if (parts.length >= 3) {
    return `${parts[0]} ${parts[1]} ${parts[2]}`;
  }
  
  return address;
};

const calculateReviewCount = (rating) => {
  if (!rating || rating === 0) return 0;
  
  const baseCount = 50;
  const multiplier = Math.pow(2, rating - 3);
  return Math.floor(baseCount * multiplier + Math.random() * 100);
};

const formatReviewText = (rating) => {
  if (!rating || rating === 0) return 'N/A';
  
  const reviewCount = calculateReviewCount(rating);
  return `${rating.toFixed(1)} (${reviewCount.toLocaleString()})`;
};

const generateMinOrder = () => {
  const amounts = [10000, 12000, 13000, 15000, 18000, 20000];
  const amount = amounts[Math.floor(Math.random() * amounts.length)];
  return `최소 주문: ${amount.toLocaleString()}원`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  } catch (error) {
    return 'N/A';
  }
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString('ko-KR');
  } catch (error) {
    return 'N/A';
  }
};

const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
};

// =====================================
// 5. 백업 데이터 (기존과 동일)
// =====================================

const getBackupRestaurants = (query, category) => {
  const backupData = [
    {
      id: 1001,
      bizName: '짬뽕관 광주송정선운점',
      roadAddr: '광주 광산구 소촌로 123',
      jibunAddr: '광주 광산구 소촌동 123-45',
      foodType: '중식',
      mainFood: '짬뽕',
      phoneNum: '062-123-4567',
      naverRating: 4.9
    },
    {
      id: 1002,
      bizName: '소풍가는 돈까스',
      roadAddr: '광주 광산구 송정로 456',
      jibunAddr: '광주 광산구 송정동 456-78',
      foodType: '일식',
      mainFood: '돈까스',
      phoneNum: '062-456-7890',
      naverRating: 4.7
    },
    {
      id: 1003,
      bizName: '맛있는 국수집',
      roadAddr: '광주 광산구 소촌로 789',
      jibunAddr: '광주 광산구 소촌동 789-12',
      foodType: '한식',
      mainFood: '국수',
      phoneNum: '062-789-0123',
      naverRating: 4.8
    }
  ];
  
  let filtered = backupData;
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    filtered = filtered.filter(r => 
      (r.bizName && r.bizName.toLowerCase().includes(lowerQuery)) ||
      (r.mainFood && r.mainFood.toLowerCase().includes(lowerQuery)) ||
      (r.foodType && r.foodType.toLowerCase().includes(lowerQuery))
    );
  }
  
  if (category && category !== 'all') {
    filtered = filtered.filter(r => r.foodType === category);
  }
  
  return filtered.map(formatDbDataToUI);
};

const getBackupRecommendedRestaurants = () => {
  const data = [
    {
      id: 4001,
      bizName: '광주정통갈비',
      roadAddr: '광주 광산구 송정로 987',
      jibunAddr: '광주 광산구 송정동 987-65',
      foodType: '한식',
      mainFood: '갈비',
      phoneNum: '062-987-6543',
      naverRating: 4.6
    }
  ];
  
  return data.map(formatDbDataToUI);
};

const getBackupFrequentRestaurants = () => {
  const data = [
    {
      id: 2001,
      bizName: '송정떡갈비1호점',
      roadAddr: '광주 광산구 송정로 123',
      jibunAddr: '광주 광산구 송정동 123-45',
      foodType: '한식',
      mainFood: '떡갈비',
      phoneNum: '062-123-4567',
      naverRating: 5.0
    }
  ];
  
  return data.map(formatDbDataToUI);
};

const getBackupBlueRibbonRestaurants = () => {
  return getBackupFrequentRestaurants().map(restaurant => ({
    ...restaurant,
    isBlueRibbon: true
  }));
};

const getBackupTrendingRestaurants = () => {
  return getBackupFrequentRestaurants();
};

const getBackupNearbyRestaurants = () => {
  return getBackupRecommendedRestaurants();
};