// Figma 모바일 앱 JavaScript - 실제 데이터베이스 연동 버전 (계속)
            container.innerHTML = restaurants.map(restaurant => 
                this.createRestaurantCard(restaurant)
            ).join('');
        } else {
            container.innerHTML = '<div class="no-results">검색 결과가 없습니다.</div>';
        }
    }

    // 섹션 로딩 표시
    showSectionLoading(sectionId) {
        const container = document.getElementById(sectionId);
        if (container) {
            container.innerHTML = `
                <div class="loading-container">
                    <div class="loading"></div>
                    <div style="margin-top: 8px; font-size: 14px; color: #8E8E93;">데이터 로딩 중...</div>
                </div>
            `;
        }
    }

    // 섹션 제목 업데이트
    updateSectionTitle(sectionId, title) {
        const container = document.getElementById(sectionId);
        if (container && container.previousElementSibling) {
            const titleElement = container.previousElementSibling;
            if (titleElement.classList.contains('section-title')) {
                titleElement.textContent = title;
            }
        }
    }

    // 레스토랑 상세 정보 표시
    async showRestaurantDetail(restaurantId) {
        this.showGlobalLoading('상세 정보 로딩 중...');
        
        try {
            const response = await fetch(`${this.apiBase}/restaurants/${restaurantId}`);
            if (response.ok) {
                const restaurant = await response.json();
                this.displayRestaurantModal(restaurant);
            } else {
                throw new Error('레스토랑 상세 정보 로딩 실패');
            }
        } catch (error) {
            console.error('레스토랑 상세 정보 에러:', error);
            this.showToast('상세 정보를 불러올 수 없습니다.');
        } finally {
            this.hideGlobalLoading();
        }
    }

    // 검색 결과 표시
    displaySearchResults(results, query) {
        console.log(`"${query}" 검색 결과:`, results);
        
        // 모든 섹션을 검색 결과로 변경
        this.renderRestaurantSection('todayRecommendations', results);
        this.renderRestaurantSection('favoriteRestaurants', []);
        this.renderRestaurantSection('blueRibbonRecommendations', []);
        
        // 섹션 제목 변경
        this.updateSectionTitle('todayRecommendations', `"${query}" 검색 결과 (${results.length}개)`);
        this.updateSectionTitle('favoriteRestaurants', '검색 결과');
        this.updateSectionTitle('blueRibbonRecommendations', '');
        
        // 결과가 없을 때 처리
        if (results.length === 0) {
            this.showEmptySearchResults(query);
        }
    }

    // 카테고리 결과 표시
    displayCategoryResults(category, restaurants) {
        console.log(`${category} 카테고리 결과:`, restaurants);
        
        // 첫 번째 섹션에 카테고리 결과 표시
        this.renderRestaurantSection('todayRecommendations', restaurants);
        this.renderRestaurantSection('favoriteRestaurants', []);
        this.renderRestaurantSection('blueRibbonRecommendations', []);
        
        // 섹션 제목 변경
        this.updateSectionTitle('todayRecommendations', `${category} 맛집 (${restaurants.length}개)`);
        this.updateSectionTitle('favoriteRestaurants', '카테고리 검색');
        this.updateSectionTitle('blueRibbonRecommendations', '');
        
        if (restaurants.length === 0) {
            this.showEmptyCategoryResults(category);
        }
    }

    // 빈 검색 결과 표시
    showEmptySearchResults(query) {
        const container = document.getElementById('todayRecommendations');
        if (container) {
            container.innerHTML = `
                <div class="empty-results">
                    <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
                    <div style="font-size: 16px; color: #1C1C1E; margin-bottom: 8px;">
                        "${query}" 검색 결과가 없습니다
                    </div>
                    <div style="font-size: 14px; color: #8E8E93; margin-bottom: 16px;">
                        다른 검색어를 시도해보세요
                    </div>
                    <button onclick="app.resetToRecommendations()" style="
                        background: #007AFF; 
                        color: white; 
                        border: none; 
                        padding: 8px 16px; 
                        border-radius: 8px; 
                        cursor: pointer;
                    ">
                        추천 맛집 보기
                    </button>
                </div>
            `;
        }
    }

    // 빈 카테고리 결과 표시
    showEmptyCategoryResults(category) {
        const container = document.getElementById('todayRecommendations');
        if (container) {
            container.innerHTML = `
                <div class="empty-results">
                    <div style="font-size: 48px; margin-bottom: 16px;">🍽️</div>
                    <div style="font-size: 16px; color: #1C1C1E; margin-bottom: 8px;">
                        ${category} 맛집이 없습니다
                    </div>
                    <div style="font-size: 14px; color: #8E8E93; margin-bottom: 16px;">
                        다른 카테고리를 선택해보세요
                    </div>
                    <button onclick="app.resetToRecommendations()" style="
                        background: #007AFF; 
                        color: white; 
                        border: none; 
                        padding: 8px 16px; 
                        border-radius: 8px; 
                        cursor: pointer;
                    ">
                        추천 맛집 보기
                    </button>
                </div>
            `;
        }
    }

    // 레스토랑 모달 표시 (개선된 버전)
    displayRestaurantModal(restaurant) {
        const modalHtml = `
            <div class="restaurant-modal-overlay" onclick="app.closeRestaurantModal()">
                <div class="restaurant-modal" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>${restaurant.name}</h2>
                        <button onclick="app.closeRestaurantModal()" style="
                            background: none; 
                            border: none; 
                            font-size: 24px; 
                            cursor: pointer; 
                            color: white;
                        ">×</button>
                    </div>
                    <div class="modal-content">
                        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                            <div style="font-size: 48px;">${restaurant.image}</div>
                            <div>
                                <div style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">${restaurant.category}</div>
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <span style="color: #FF9500;">★</span>
                                    <span>${restaurant.rating} (${restaurant.reviews}개 리뷰)</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="info-section">
                            <h3>📍 위치 정보</h3>
                            <p><strong>거리:</strong> ${restaurant.distance}</p>
                            <p><strong>주소:</strong> ${restaurant.address || restaurant.location}</p>
                        </div>
                        
                        <div class="info-section">
                            <h3>📞 연락처</h3>
                            <p>${restaurant.phone || '전화번호 정보 없음'}</p>
                        </div>
                        
                        <div class="info-section">
                            <h3>💰 주문 정보</h3>
                            <p><strong>최소 주문:</strong> ${restaurant.minOrder}</p>
                        </div>
                        
                        <div class="info-section">
                            <h3>🕒 운영 시간</h3>
                            <p>${restaurant.operatingHours || '운영시간 정보 없음'}</p>
                        </div>
                        
                        ${restaurant.description ? `
                        <div class="info-section">
                            <h3>ℹ️ 설명</h3>
                            <p>${restaurant.description}</p>
                        </div>
                        ` : ''}
                        
                        <div style="display: flex; gap: 8px; margin-top: 20px;">
                            <button onclick="app.toggleFavorite(${restaurant.id})" style="
                                flex: 1; 
                                background: #FF3B30; 
                                color: white; 
                                border: none; 
                                padding: 12px; 
                                border-radius: 8px; 
                                cursor: pointer;
                            ">
                                ❤️ 즐겨찾기
                            </button>
                            <button onclick="app.shareRestaurant(${restaurant.id})" style="
                                flex: 1; 
                                background: #34C759; 
                                color: white; 
                                border: none; 
                                padding: 12px; 
                                border-radius: 8px; 
                                cursor: pointer;
                            ">
                                📤 공유하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 기존 모달 제거
        this.closeRestaurantModal();
        
        // 새 모달 추가
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // 모달 닫기
    closeRestaurantModal() {
        const modal = document.querySelector('.restaurant-modal-overlay');
        if (modal) {
            modal.remove();
        }
    }

    // 즐겨찾기 토글
    async toggleFavorite(restaurantId) {
        try {
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            const isFavorited = favorites.includes(restaurantId);
            
            if (isFavorited) {
                const index = favorites.indexOf(restaurantId);
                favorites.splice(index, 1);
                this.showToast('즐겨찾기에서 제거되었습니다');
            } else {
                favorites.push(restaurantId);
                this.showToast('즐겨찾기에 추가되었습니다');
            }
            
            localStorage.setItem('favorites', JSON.stringify(favorites));
            
        } catch (error) {
            console.error('즐겨찾기 토글 실패:', error);
            this.showToast('즐겨찾기 처리 중 오류가 발생했습니다');
        }
    }

    // 맛집 공유
    shareRestaurant(restaurantId) {
        if (navigator.share) {
            navigator.share({
                title: '맛집 추천',
                text: '이 맛집 어때요?',
                url: window.location.href
            });
        } else {
            // 폴백: 클립보드에 복사
            navigator.clipboard.writeText(window.location.href);
            this.showToast('링크가 클립보드에 복사되었습니다');
        }
    }

    // 다크모드 토글
    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        this.showToast(
            document.body.classList.contains('dark-mode') ? 
            '🌙 다크모드 활성화' : '☀️ 라이트모드 활성화'
        );
    }

    // 토스트 메시지 표시 (개선된 버전)
    showToast(message, duration = 3000) {
        const existingToast = document.querySelector('.custom-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.85);
            color: white;
            padding: 12px 20px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 2000;
            max-width: 300px;
            text-align: center;
            transition: all 0.3s ease;
            white-space: pre-line;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px);
        `;

        document.body.appendChild(toast);

        // 애니메이션
        setTimeout(() => toast.style.opacity = '1', 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // 전역 로딩 표시
    showGlobalLoading(message = '로딩 중...') {
        this.hideGlobalLoading(); // 기존 로딩 제거
        
        const loading = document.createElement('div');
        loading.id = 'global-loading';
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 3000;
            color: white;
            backdrop-filter: blur(5px);
        `;
        loading.innerHTML = `
            <div style="
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255,255,255,0.3);
                border-top: 4px solid #007AFF;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            "></div>
            <div style="font-size: 16px; font-weight: 500;">${message}</div>
        `;

        document.body.appendChild(loading);
    }

    // 전역 로딩 숨김
    hideGlobalLoading() {
        const loading = document.getElementById('global-loading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => loading.remove(), 300);
        }
    }
}

// 앱 초기화
let app;
document.addEventListener('DOMContentLoaded', function() {
    app = new FigmaMobileApp();
    
    // 다크모드 설정 복원
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // 필요한 CSS 추가
    if (!document.querySelector('#app-styles')) {
        const style = document.createElement('style');
        style.id = 'app-styles';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .empty-results {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 40px 20px;
                text-align: center;
            }
            
            .no-results {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 40px;
                color: #8E8E93;
                font-size: 14px;
            }
            
            .restaurant-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2500;
                padding: 20px;
            }
            
            .restaurant-modal {
                background: white;
                border-radius: 16px;
                max-width: 400px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            
            .modal-header {
                background: #007AFF;
                color: white;
                padding: 16px 20px;
                border-radius: 16px 16px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h2 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }
            
            .modal-content {
                padding: 20px;
            }
            
            .info-section {
                margin-bottom: 16px;
                padding-bottom: 16px;
                border-bottom: 1px solid #F2F2F7;
            }
            
            .info-section:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
            
            .info-section h3 {
                margin: 0 0 8px 0;
                font-size: 14px;
                font-weight: 600;
                color: #007AFF;
            }
            
            .info-section p {
                margin: 4px 0;
                font-size: 14px;
                color: #1C1C1E;
                line-height: 1.4;
            }
            
            .category-badge {
                position: absolute !important;
            }
        `;
        document.head.appendChild(style);
    }
});

// 전역 함수들
function showRestaurantDetail(restaurantId) {
    if (app) {
        app.showRestaurantDetail(restaurantId);
    }
}

function toggleDarkMode() {
    if (app) {
        app.toggleDarkMode();
    }
}