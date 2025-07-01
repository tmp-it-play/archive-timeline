import './RatingFilter.css';

const RatingFilter = ({ selectedRating, onRatingChange }) => {
  const ratingOptions = [
    { value: null, label: '전체', icon: '⭐', description: '모든 평점' },
    { value: 4.0, label: '4.0+', icon: '⭐⭐⭐⭐', description: '4.0점 이상' },
    { value: 4.5, label: '4.5+', icon: '⭐⭐⭐⭐⭐', description: '4.5점 이상' },
    { value: 4.8, label: '4.8+', icon: '🏆', description: '4.8점 이상 (최고급)' }
  ];

  const handleRatingClick = (ratingValue) => {
    // 같은 값 클릭시 토글 (선택 해제)
    const newValue = selectedRating === ratingValue ? null : ratingValue;
    if (onRatingChange && typeof onRatingChange === 'function') {
      onRatingChange(newValue);
    }
  };

  return (
    <div className="rating-filter">
      <div className="filter-header">
        <h4 className="filter-title">별점 필터</h4>
        <span className="filter-subtitle">원하는 평점 이상의 맛집만 보기</span>
      </div>
      
      <div className="rating-options">
        {ratingOptions.map(option => (
          <button
            key={option.value || 'all'}
            className={`rating-option ${selectedRating === option.value ? 'active' : ''}`}
            onClick={() => handleRatingClick(option.value)}
            title={option.description}
          >
            <div className="option-content">
              <span className="rating-icon">{option.icon}</span>
              <span className="rating-label">{option.label}</span>
            </div>
            {selectedRating === option.value && (
              <span className="active-indicator">✓</span>
            )}
          </button>
        ))}
      </div>
      
      {selectedRating && (
        <div className="active-filter-info">
          <span className="info-icon">🔍</span>
          <span className="info-text">
            {selectedRating}점 이상 맛집만 표시 중
          </span>
          <button 
            className="clear-filter" 
            onClick={() => handleRatingClick(null)}
            title="필터 해제"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default RatingFilter;