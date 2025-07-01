import { useState } from 'react';
import RatingFilter from './RatingFilter';
import FoodCategories from './FoodCategories';
import './AdvancedSearchModal.css';

const AdvancedSearchModal = ({ isOpen, onClose, onSearch, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    category: 'all',
    minRating: null,
    sortBy: 'relevance',
    ...initialFilters
  });

  const [errors, setErrors] = useState({});

  const sortOptions = [
    { value: 'relevance', label: '관련도 순', icon: '🎯' },
    { value: 'rating', label: '평점 높은 순', icon: '⭐' },
    { value: 'distance', label: '거리 순', icon: '📍' },
    { value: 'name', label: '이름 순', icon: '🔤' }
  ];

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 에러 초기화
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateFilters = () => {
    const newErrors = {};
    
    if (filters.keyword && filters.keyword.length > 100) {
      newErrors.keyword = '검색어는 100자 이내로 입력해주세요.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    if (!validateFilters()) {
      return;
    }

    // 검색 실행
    if (onSearch && typeof onSearch === 'function') {
      onSearch(filters);
    }
    
    onClose();
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      category: 'all',
      minRating: null,
      sortBy: 'relevance'
    });
    setErrors({});
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="advanced-search-modal" onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <div className="modal-header">
          <h3 className="modal-title">상세 검색</h3>
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="모달 닫기"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-content">
          {/* 키워드 검색 */}
          <div className="search-section">
            <label className="section-label">
              <span className="label-icon">🔍</span>
              <span className="label-text">검색어</span>
            </label>
            <input
              type="text"
              className={`search-input ${errors.keyword ? 'error' : ''}`}
              placeholder="메뉴명, 가게명, 음식 종류 등을 입력하세요"
              value={filters.keyword}
              onChange={(e) => handleInputChange('keyword', e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={100}
            />
            {errors.keyword && (
              <span className="error-message">{errors.keyword}</span>
            )}
            <div className="input-hint">
              예: 짬뽕, 한식, 떡갈비 등
            </div>
          </div>

          {/* 카테고리 선택 */}
          <div className="category-section">
            <label className="section-label">
              <span className="label-icon">🍽️</span>
              <span className="label-text">카테고리</span>
            </label>
            <FoodCategories 
              selectedCategory={filters.category}
              onCategorySelect={(category) => handleInputChange('category', category || 'all')}
            />
          </div>

          {/* 별점 필터 */}
          <div className="rating-section">
            <RatingFilter 
              selectedRating={filters.minRating}
              onRatingChange={(rating) => handleInputChange('minRating', rating)}
            />
          </div>

          {/* 정렬 옵션 */}
          <div className="sort-section">
            <label className="section-label">
              <span className="label-icon">📊</span>
              <span className="label-text">정렬 순서</span>
            </label>
            <div className="sort-options">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  className={`sort-option ${
                    filters.sortBy === option.value ? 'active' : ''
                  }`}
                  onClick={() => handleInputChange('sortBy', option.value)}
                >
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 현재 필터 요약 */}
          <div className="filter-summary">
            <h4 className="summary-title">현재 검색 조건</h4>
            <div className="summary-items">
              {filters.keyword && (
                <span className="summary-item">
                  🔍 "{filters.keyword}"
                </span>
              )}
              {filters.category !== 'all' && (
                <span className="summary-item">
                  🍽️ {filters.category}
                </span>
              )}
              {filters.minRating && (
                <span className="summary-item">
                  ⭐ {filters.minRating}점 이상
                </span>
              )}
              <span className="summary-item">
                 {sortOptions.find(opt => opt.value === filters.sortBy)?.label}
              </span>
            </div>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="modal-footer">
          <button 
            className="reset-btn"
            onClick={handleReset}
          >
            <span className="btn-icon">🔄</span>
            <span className="btn-text">초기화</span>
          </button>
          
          <button 
            className="cancel-btn"
            onClick={onClose}
          >
            취소
          </button>
          
          <button 
            className="search-btn"
            onClick={handleSearch}
          >
            <span className="btn-icon">🔍</span>
            <span className="btn-text">검색</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchModal;