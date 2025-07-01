import { useState, useEffect } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import axios from 'axios';
import './RestaurantDetailPage.css';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const RestaurantDetailPage = ({ restaurant, onClose }) => {
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchDetail = async () => {
      if (!restaurant?.id) {
        setError('맛집 정보가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // SearchController의 /detail/{id} API 사용
        const response = await API.get(`/v1/search/detail/${restaurant.id}`);
        setDetailData(response.data);
      } catch (error) {
        console.error('상세 정보 조회 실패:', error);
        setError('상세 정보를 불러올 수 없습니다.');
        
        // 기본 상세 정보 생성
        setDetailData({
          isOpen: true,
          openingHours: '09:00 - 22:00 (매일)',
          facilities: ['주차가능', 'WiFi', '포장가능', '배달가능'],
          nearbyPlaces: ['지하철역 도보 5분', '버스정류장 도보 2분', '공영주차장 이용가능']
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [restaurant?.id]);

  const handleFavoriteClick = async () => {
    const success = await toggleFavorite(restaurant.id);
    if (success) {
      // 성공 피드백
      const action = isFavorite(restaurant.id) ? '추가' : '제거';
      console.log(`즐겨찾기 ${action} 완료`);
    }
  };

  const handleCallClick = () => {
    if (restaurant.phone && restaurant.phone !== 'N/A') {
      const phoneNumber = restaurant.phone.replace(/[^0-9]/g, '');
      window.location.href = `tel:${phoneNumber}`;
    } else {
      alert('전화번호 정보가 없습니다.');
    }
  };

  const handleDirectionsClick = () => {
    if (restaurant.address && restaurant.address !== 'N/A') {
      const address = encodeURIComponent(restaurant.address);
      // 카카오맵 또는 구글맵으로 길찾기
      const kakaoMapUrl = `https://map.kakao.com/link/to/${encodeURIComponent(restaurant.name)},${address}`;
      window.open(kakaoMapUrl, '_blank');
    } else {
      alert('주소 정보가 없습니다.');
    }
  };

  if (!restaurant) {
    return (
      <div className="detail-page-overlay">
        <div className="detail-page">
          <div className="detail-error">
            <h3>오류</h3>
            <p>맛집 정보를 찾을 수 없습니다.</p>
            <button onClick={onClose} className="close-btn">닫기</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page-overlay" onClick={onClose}>
      <div className="detail-page" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="detail-header">
          <button className="back-btn" onClick={onClose} aria-label="뒤로가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h2 className="detail-title">{restaurant.name}</h2>
          <button 
            className={`favorite-header-btn ${isFavorite(restaurant.id) ? 'favorited' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite(restaurant.id) ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          >
            {isFavorite(restaurant.id) ? '❤️' : '🤍'}
          </button>
        </div>

        <div className="detail-content">
          {loading ? (
            <div className="detail-loading">
              <div className="loading-spinner"></div>
              <p>상세 정보를 불러오는 중...</p>
            </div>
          ) : (
            <>
              {/* 맛집 메인 이미지 */}
              <div className="detail-image-section">
                <div className="main-image">
                  {restaurant.image && restaurant.image !== 'N/A' ? (
                    <img src={restaurant.image} alt={restaurant.name} />
                  ) : (
                    <div className="no-image">
                      <span>🍽️</span>
                      <p>이미지 없음</p>
                    </div>
                  )}
                </div>
                
                {/* 배지들 */}
                <div className="image-badges">
                  {restaurant.isBlueRibbon && (
                    <span className="blue-ribbon-badge">🏆 블루리본</span>
                  )}
                  <span className="category-badge">{restaurant.category}</span>
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="detail-info-section">
                <div className="info-header">
                  <h3 className="restaurant-name">{restaurant.name}</h3>
                  {restaurant.mainFood && restaurant.mainFood !== 'N/A' && (
                    <p className="main-food">🍴 {restaurant.mainFood}</p>
                  )}
                </div>

                {/* 평점 정보 */}
                <div className="rating-section">
                  <div className="rating-display">
                    <span className="star-icon">⭐</span>
                    <span className="rating-value">
                      {restaurant.rating > 0 ? restaurant.rating.toFixed(1) : 'N/A'}
                    </span>
                    {restaurant.reviewCount > 0 && (
                      <span className="review-count">({restaurant.reviewCount.toLocaleString()})</span>
                    )}
                  </div>
                  {restaurant.isBlueRibbon && (
                    <span className="blue-ribbon-text">🏆 블루리본 인증 맛집</span>
                  )}
                </div>

                {/* 위치 정보 */}
                <div className="location-section">
                  <div className="address-info">
                    <span className="location-icon">📍</span>
                    <div className="address-details">
                      <p className="address">{restaurant.address}</p>
                      <p className="distance">🚶 약 {restaurant.distance}</p>
                    </div>
                  </div>
                </div>

                {/* 연락처 정보 */}
                {restaurant.phone && restaurant.phone !== 'N/A' && (
                  <div className="contact-section">
                    <span className="phone-icon">📞</span>
                    <span className="phone-number">{restaurant.phone}</span>
                  </div>
                )}

                {/* 최소 주문 금액 */}
                {restaurant.minOrder && (
                  <div className="order-info">
                    <span className="order-icon">💰</span>
                    <span className="min-order">{restaurant.minOrder}</span>
                  </div>
                )}
              </div>

              {/* 운영 정보 */}
              {detailData && (
                <div className="operation-section">
                  <h4 className="section-title">운영 정보</h4>
                  <div className="operation-details">
                    <div className="operation-item">
                      <span className="op-icon">🕐</span>
                      <div className="op-content">
                        <span className="op-label">영업시간</span>
                        <span className="op-value">{detailData.openingHours || '정보 없음'}</span>
                      </div>
                    </div>
                    <div className="operation-item">
                      <span className="op-icon">
                        {detailData.isOpen ? '🟢' : '🔴'}
                      </span>
                      <div className="op-content">
                        <span className="op-label">영업상태</span>
                        <span className={`op-value ${detailData.isOpen ? 'open' : 'closed'}`}>
                          {detailData.isOpen ? '영업 중' : '영업 종료'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 편의시설 */}
              {detailData?.facilities && detailData.facilities.length > 0 && (
                <div className="facilities-section">
                  <h4 className="section-title">편의시설</h4>
                  <div className="facility-tags">
                    {detailData.facilities.map((facility, index) => (
                      <span key={index} className="facility-tag">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 주변 정보 */}
              {detailData?.nearbyPlaces && detailData.nearbyPlaces.length > 0 && (
                <div className="nearby-section">
                  <h4 className="section-title">주변 정보</h4>
                  <div className="nearby-list">
                    {detailData.nearbyPlaces.map((place, index) => (
                      <div key={index} className="nearby-item">
                        <span className="nearby-icon">🚶</span>
                        <span className="nearby-text">{place}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 에러 메시지 */}
              {error && (
                <div className="error-section">
                  <span className="error-icon">⚠️</span>
                  <p className="error-text">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* 하단 액션 버튼들 */}
        <div className="detail-actions">
          <button 
            className="action-btn call-btn"
            onClick={handleCallClick}
            disabled={!restaurant.phone || restaurant.phone === 'N/A'}
          >
            <span className="action-icon">📞</span>
            <span className="action-text">전화</span>
          </button>
          
          <button 
            className="action-btn directions-btn"
            onClick={handleDirectionsClick}
            disabled={!restaurant.address || restaurant.address === 'N/A'}
          >
            <span className="action-icon">🗺️</span>
            <span className="action-text">길찾기</span>
          </button>
          
          <button 
            className={`action-btn favorite-btn ${isFavorite(restaurant.id) ? 'favorited' : ''}`}
            onClick={handleFavoriteClick}
          >
            <span className="action-icon">
              {isFavorite(restaurant.id) ? '❤️' : '🤍'}
            </span>
            <span className="action-text">
              {isFavorite(restaurant.id) ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;