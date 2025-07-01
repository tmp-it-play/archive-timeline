import './SearchBar.css';

import { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, placeholder = "먹고 싶은 메뉴나 가게를 검색해 주세요" }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    
    try {
      if (onSearch && typeof onSearch === 'function') {
        await onSearch(searchQuery.trim());
      }
    } catch (error) {
      console.error('검색 처리 오류:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            disabled={isSearching}
          />
          
          {/* 검색 버튼 */}
          <button 
            type="submit" 
            className="search-button"
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <div className="search-loading">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="15 5" transform="rotate(0 12 12)">
                    <animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="1s" repeatCount="indefinite"/>
                  </circle>
                </svg>
              </div>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* 검색 힌트 */}
      <div className="search-hints">
        <p className="hint-text">
          💡 팁: 업소명, 음식 종류, 지역으로 검색해보세요 (예: 짬뽕, 한식, 광산구)
        </p>
      </div>
    </div>
  );
};

export default SearchBar;