import { useState, useEffect } from 'react';
import RestaurantCard from './RestaurantCard';
import './RestaurantSection.css';

const RestaurantSection = ({ 
  title, 
  subtitle,
  fetchFunction, 
  showDataInfo = false,
  maxItems = 3 
}) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRestaurants = async () => {
      if (!fetchFunction) {
        setLoading(false);
        setError('데이터 로딩 함수가 제공되지 않았습니다.');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchFunction();
        
        if (Array.isArray(data)) {
          // 최대 개수 제한
          const limitedData = data.slice(0, maxItems);
          setRestaurants(limitedData);
        } else {
          console.warn('예상하지 못한 데이터 형식:', data);
          setRestaurants([]);
        }
      } catch (err) {
        console.error(`${title} 데이터 로딩 오류:`, err);
        setError('데이터를 불러올 수 없습니다.');
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, [fetchFunction, title, maxItems]);

  const handleRestaurantClick = (restaurant) => {
    console.log(`${title} - 선택된 맛집:`, restaurant);
    // TODO: 상세 페이지로 이동하는 로직 추가
  };

  if (loading) {
    return (
      <div className="restaurant-section">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        <div className="section-loading">
          <div className="loading-spinner"></div>
          <p>맛집 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="restaurant-section">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        <div className="section-error">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <p className="error-detail">서버 연결을 확인해주세요.</p>
        </div>
      </div>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="restaurant-section">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        <div className="section-empty">
          <div className="empty-icon">🍽️</div>
          <p>표시할 맛집이 없습니다.</p>
          <p className="empty-detail">다른 조건으로 다시 시도해보세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
        <div className="section-count">
          {restaurants.length}개 맛집
        </div>
      </div>
      
      <div className="restaurant-grid">
        {restaurants.map((restaurant, index) => (
          <RestaurantCard
            key={restaurant.id || `${title}-${index}`}
            restaurant={restaurant}
            showDataInfo={showDataInfo}
            onClick={handleRestaurantClick}
          />
        ))}
      </div>

      {/* 더보기 버튼 (현재는 비활성화) */}
      {/* 
      <div className="section-footer">
        <button className="view-more-button" disabled>
          더 많은 맛집 보기 (준비 중)
        </button>
      </div>
      */}
    </div>
  );
};

export default RestaurantSection;