import './RestaurantCard.css';
import { useFavorites } from '../hooks/useFavorites';

const RestaurantCard = ({ restaurant, showDataInfo = false, onClick }) => {
  const { toggleFavorite, isFavorite } = useFavorites();

  if (!restaurant) {
    return (
      <div className="restaurant-card error">
        <div className="error-content">
          <p>데이터를 불러올 수 없습니다</p>
        </div>
      </div>
    );
  }

  const {
    id,
    name,
    distance,
    location,
    rating,
    reviewCount,
    reviewText,
    minOrder,
    image,
    category,
    isBlueRibbon,
    // data 엔티티 기반 추가 정보
    phone,
    mainFood,
    address,
    originalData
  } = restaurant;

  // 값이 없거나 N/A인 경우 처리
  const displayName = name && name !== 'N/A' ? name : '정보 없음';
  const displayDistance = distance && distance !== 'N/A' ? distance : 'N/A';
  const displayLocation = location && location !== 'N/A' ? location : 'N/A';
  const displayRating = rating && rating > 0 ? rating : 0;
  const displayCategory = category && category !== 'N/A' ? category : '기타';
  const displayMainFood = mainFood && mainFood !== 'N/A' ? mainFood : null;

  const handleFavoriteClick = async (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    const success = await toggleFavorite(id);
    if (success) {
      console.log(`즐겨찾기 ${isFavorite(id) ? '해제' : '추가'} 완료:`, displayName);
    }
  };

  const handleCardClick = () => {
    if (onClick && typeof onClick === 'function') {
      onClick(restaurant);
    } else {
      // 기본 동작: 상세 정보 콘솔 출력
      console.log('맛집 상세 정보:', restaurant);
    }
  };

  return (
    <div className="restaurant-card" onClick={handleCardClick}>
      {/* 이미지 영역 */}
      <div className="restaurant-image">
        {image && image !== 'N/A' ? (
          <div 
            className="image-placeholder" 
            style={{ backgroundImage: `url(${image})` }}
          />
        ) : (
          <div className="no-image">
            <span>🍽️</span>
          </div>
        )}
        
        {/* 즐겨찾기 버튼 */}
        <button 
          className={`favorite-btn ${isFavorite(restaurant.id) ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          title={isFavorite(restaurant.id) ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        >
          {isFavorite(restaurant.id) ? '❤️' : '🤍'}
        </button>

        {/* 블루리본 배지 */}
        {isBlueRibbon && (
          <div className="blue-ribbon-badge">
            <span>⭐</span>
            <span>블루리본</span>
          </div>
        )}

        {/* 카테고리 태그 */}
        <div className="category-tag">
          {displayCategory}
        </div>
        
        {/* 즐겨찾기 버튼 */}
        <button 
          className={`favorite-btn ${isFavorite(id) ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          title={isFavorite(id) ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          aria-label={isFavorite(id) ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        >
          {isFavorite(id) ? '❤️' : '🤍'}
        </button>
      </div>

      {/* 정보 영역 */}
      <div className="restaurant-details">
        {/* 업소명 */}
        <h3 className="restaurant-name" title={displayName}>
          {displayName}
        </h3>
        
        {/* 주된 음식 (있는 경우) */}
        {displayMainFood && (
          <p className="main-food">
            <span className="food-icon">🍴</span>
            {displayMainFood}
          </p>
        )}
        
        {/* 위치 정보 */}
        <div className="location-info">
          <span className="distance" title="거리">
            📍 {displayDistance}
          </span>
          <span className="location" title="주소">
            {displayLocation}
          </span>
        </div>
        
        {/* 평점 및 리뷰 정보 */}
        <div className="rating-info">
          <div className="rating">
            {displayRating > 0 ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M7.53834 1.10997C7.70914 0.699319 8.29086 0.699318 8.46166 1.10997L10.0642 4.88879C10.1356 5.05674 10.2934 5.17181 10.476 5.19341L14.5208 5.61248C14.9655 5.65494 15.1417 6.20732 14.8039 6.49444L11.7894 9.11266C11.6527 9.23375 11.5894 9.41549 11.6203 9.59359L12.397 13.5949C12.4848 14.0326 12.0141 14.3726 11.6216 14.1483L8.10313 12.1331C7.94327 12.0412 7.75045 12.0412 7.59059 12.1331L4.07839 14.1483C3.68594 14.3726 3.21521 14.0326 3.30297 13.5949L4.07975 9.59359C4.11065 9.41549 4.04731 9.23375 3.91062 9.11266L0.896083 6.49444C0.558348 6.20732 0.734463 5.65494 1.17916 5.61248L5.22404 5.19341C5.40659 5.17181 5.56442 5.05674 5.63582 4.88879L7.53834 1.10997Z" 
                    fill={isBlueRibbon ? "#0064FF" : "#FFD600"} 
                  />
                </svg>
                <span className="rating-value">{displayRating.toFixed(1)}</span>
                {reviewCount > 0 && (
                  <span className="review-count">({reviewCount.toLocaleString()})</span>
                )}
              </>
            ) : (
              <span className="no-rating">평점 없음</span>
            )}
          </div>
          
          {/* 최소 주문 금액 */}
          <span className="min-order">
            {minOrder || 'N/A'}
          </span>
        </div>

        {/* Data 엔티티 정보 표시 (showDataInfo가 true일 때) */}
        {showDataInfo && (
          <div className="data-entity-info">
            {phone && phone !== 'N/A' && (
              <div className="info-item">
                <span className="info-icon">📞</span>
                <span className="info-text">{phone}</span>
              </div>
            )}
            
            {/* 데이터 ID 표시 (개발용) */}
            <div className="data-id">
              <span className="info-label">ID:</span>
              <span className="info-value">{id}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;