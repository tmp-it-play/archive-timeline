import { useEffect, useState } from 'react';
import axios from 'axios';
import BottomNavigation from '../components/BottomNavigation.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FoodCategories from '../components/FoodCategories.jsx';
import RestaurantSection from '../components/RestaurantSection.jsx';
import RestaurantCard from '../components/RestaurantCard.jsx';
import RatingFilter from '../components/RatingFilter.jsx';
import AdvancedSearchModal from '../components/AdvancedSearchModal.jsx';
import RestaurantDetailPage from './RestaurantDetailPage.jsx';
import { useFavorites } from '../hooks/useFavorites.js';
import { 
  fetchRecommendedRestaurants, 
  fetchFrequentRestaurants, 
  fetchBlueRibbonRestaurants,
  searchRestaurants
} from '../api/index.js';
import MapView from '../components/MapView.jsx';
import './HomePage.css';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [serverConnected, setServerConnected] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const { getFavoriteRestaurants } = useFavorites();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // 서버 연결 확인 및 초기 데이터 로드
    const initializeApp = async () => {
      try {
        // 서버 연결 테스트
        const response = await axios.get('http://localhost:8080/api/v1/search', {
          params: {
            type: 'db',
            q: '맛집'
          },
          timeout: 3000
        });
        
        if (response.status === 200) {
          console.log('서버에 성공적으로 연결되었습니다.');
          setServerConnected(true);
        }
      } catch (error) {
        console.warn('서버에 연결할 수 없습니다. 백업 데이터를 사용합니다.', error);
        setServerConnected(false);
      } finally {
        // 로딩 완료
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    initializeApp();
    
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  // 검색 결과 처리
  const handleSearchResults = async (query) => {
    if (query === undefined || query === null) {
      setSearchResults(null);
      return;
    }
    try {
      // q 파라미터가 항상 전달되도록 빈 문자열이라도 넘김
      const results = await searchRestaurants(query || '', selectedCategory);
      if (!results || results.length === 0) {
        setSearchResults([]);
        return;
      }
      setSearchResults(results);
    } catch (error) {
      console.error('검색 처리 오류:', error);
      setSearchResults([]);
    }
  };

  // 카테고리 선택 처리 (업데이트됨)
  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    if (category === 'all' || !category) {
      setSearchResults(null);
      setSelectedRating(null);
      return;
    }
    try {
      // 카테고리명을 q로 넘기고 category 파라미터는 null로 전달
      const results = await searchRestaurants(category, null, selectedRating);
      setSearchResults(results);
    } catch (error) {
      console.error('카테고리 검색 오류:', error);
      setSearchResults([]);
    }
  };

  // 별점 필터 처리
  const handleRatingFilter = async (minRating) => {
    setSelectedRating(minRating);
    try {
      // q 파라미터가 항상 전달되도록 빈 문자열이라도 넘김
      const results = await searchRestaurants('', selectedCategory, minRating);
      setSearchResults(results);
    } catch (error) {
      console.error('별점 필터링 오류:', error);
    }
  };

  // 고급 검색 처리
  const handleAdvancedSearch = async (filters) => {
    try {
      const results = await searchRestaurants(
        filters.keyword || '', 
        filters.category !== 'all' ? filters.category : null,
        filters.minRating,
        null, // location 제거
        filters.sortBy
      );
      
      setSearchResults(results);
      setSelectedCategory(filters.category);
      setSelectedRating(filters.minRating);
    } catch (error) {
      console.error('고급 검색 오류:', error);
      setSearchResults([]);
    }
  };

  // 맛집 상세 정보 보기
  const handleRestaurantDetail = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  // 즐겨찾기 맛집 조회
  const fetchMyFavoriteRestaurants = async () => {
    try {
      const favorites = await getFavoriteRestaurants();
      return favorites.slice(0, 3); // 최대 3개만 표시
    } catch (error) {
      console.error('즐겨찾기 맛집 조회 오류:', error);
      return [];
    }
  };

  const clearSearchResults = () => {
    setSearchResults(null);
    setSelectedCategory(null);
    setSelectedRating(null);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>맛집 데이터 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* 상태바 */}
      <div className="status-bar">
        <div className="time">{currentTime}</div>
        <div className="status-info">
          <span className={`connection-status ${serverConnected ? 'connected' : 'offline'}`}>
            {serverConnected ? '온라인' : '오프라인'}
          </span>
        </div>
        <div className="icons">
          <div className="icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 5H21V19H3V5Z" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5Z" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>
      </div>

      {/* 헤더 - 검색바와 카테고리 */}
      <div className="home-header">
        <div className="search-section">
          <SearchBar onSearch={handleSearchResults} />
          <button 
            className="advanced-search-btn"
            onClick={() => setShowAdvancedSearch(true)}
            title="상세 검색"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7H21M9 12H21M11 17H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        <div className="filters-area">
          <FoodCategories 
            onCategorySelect={handleCategorySelect} 
            selectedCategory={selectedCategory} 
          />
          
          {/* 별점 필터 */}
          <RatingFilter 
            selectedRating={selectedRating}
            onRatingChange={handleRatingFilter}
          />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="content-area">
        {searchResults !== null ? (
          // 검색 결과 표시
          <div className="search-results-section">
            <div className="search-results-header">
              <h2 className="section-title">
                검색 결과 {searchResults.length > 0 && `(${searchResults.length}개)`}
              </h2>
              <button className="clear-search-button" onClick={clearSearchResults}>
                초기화
              </button>
            </div>

            {/* 맛집 지도: 검색 결과가 있을 때만 노출 */}
            {searchResults.length > 0 && (
              <MapView restaurants={searchResults} />
            )}

            {searchResults.length === 0 ? (
              <div className="empty-results">
                <div className="empty-icon">🔍</div>
                <p>검색 결과가 없습니다.</p>
                <p>다른 검색어나 카테고리로 다시 시도해보세요.</p>
                {!serverConnected && (
                  <p className="offline-notice">
                    * 현재 오프라인 상태입니다. 제한된 데이터만 사용할 수 있습니다.
                  </p>
                )}
              </div>
            ) : (
              <div className="restaurant-list">
                {searchResults.map(restaurant => (
                  <RestaurantCard 
                    key={restaurant.id} 
                    restaurant={restaurant}
                    showDataInfo={true}
                    onClick={handleRestaurantDetail}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // 기본 홈 화면 표시 (data 엔티티 기반 섹션들)
          <>
            {/* 오늘의 우리동네 추천 */}
            <RestaurantSection 
              title="오늘의 우리동네 추천" 
              subtitle="주변 맛집을 찾아보세요"
              fetchFunction={fetchRecommendedRestaurants} 
              showDataInfo={true}
            />
            
            {/* 나의 또간집 (즐겨찾기 맛집) */}
            <RestaurantSection 
              title="나의 또간집" 
              subtitle="즐겨찾기에 추가한 맛집"
              fetchFunction={fetchMyFavoriteRestaurants} 
              showDataInfo={true}
            />
            
            {/* 오늘의 블루리본 추천 */}
            <RestaurantSection 
              title="오늘의 블루리본 추천" 
              subtitle="4.8점 이상 최고 맛집"
              fetchFunction={fetchBlueRibbonRestaurants} 
              showDataInfo={true}
            />

            {/* 데이터 정보 섹션 */}
            {!serverConnected && (
              <div className="data-info-section">
                <div className="data-info-card">
                  <h3>📊 데이터 정보</h3>
                  <p>현재 오프라인 모드로 실행 중입니다.</p>
                  <p>실제 서버 연결 시 더 많은 맛집 정보를 확인할 수 있습니다.</p>
                  <ul>
                    <li>• 업소명, 주소, 음식 유형</li>
                    <li>• 전화번호, 인허가 정보</li>
                    <li>• 네이버 평점 (있는 경우)</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 하단 네비게이션 */}
      <div className="bottom-nav-container">
        <BottomNavigation />
      </div>

      {/* 고급 검색 모달 */}
      <AdvancedSearchModal 
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={handleAdvancedSearch}
        initialFilters={{
          keyword: '',
          category: selectedCategory || 'all',
          minRating: selectedRating,
          sortBy: 'relevance'
        }}
      />

      {/* 맛집 상세 페이지 */}
      {selectedRestaurant && (
        <RestaurantDetailPage 
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}
    </div>
  );
};

export default HomePage;