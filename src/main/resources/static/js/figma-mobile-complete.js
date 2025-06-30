// Figma 모바일 앱 JavaScript - 완전한 기능 구현

class FigmaApp {
    constructor() {
        this.currentView = 'onboarding';
        this.searchResults = [];
        this.favorites = [];
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.addRequiredStyles();
        console.log('Figma 앱 초기화 완료');
    }
    
    addRequiredStyles() {
        if (!document.querySelector('#figma-app-styles')) {
            const style = document.createElement('style');
            style.id = 'figma-app-styles';
            style.textContent = `
                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
                @keyframes slideOutUp {
                    from {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                .category-item.selected {
                    transform: scale(0.95) !important;
                    background: #FFB800 !important;
                    color: white !important;
                }
                .restaurant-modal .modal-content {
                    animation: modalSlideIn 0.3s ease;
                }
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .btn-primary {
                    background: #FFB800;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    margin: 8px;
                    cursor: pointer;
                }
                .btn-secondary {
                    background: #F2F2F7;
                    color: #1C1C1E;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    margin: 8px;
                    cursor: pointer;
                }
                .modal-close {
                    position: absolute;
                    top: 12px;
                    right: 16px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #8E8E93;
                }
                .modal-header {
                    position: relative;
                    margin-bottom: 16px;
                }
                .modal-actions {
                    margin-top: 20px;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupEventListeners() {
        // 온보딩 화면 이벤트
        const onboarding = document.getElementById('onboarding');
        
        if (onboarding) {
            onboarding.addEventListener('click', () => {
                this.showMainScreen();
            });
        }
        
        // 검색 기능
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(e.target.value);
                }
            });
        }
        
        // 이벤트 위임 사용
        document.addEventListener('click', (e) => {
            const categoryItem = e.target.closest('.category-item');
            if (categoryItem) {
                const category = categoryItem.dataset.category;
                this.handleCategoryClick(category);
                return;
            }
            
            const restaurantCard = e.target.closest('.restaurant-card');
            if (restaurantCard) {
                this.handleRestaurantClick(restaurantCard);
                return;
            }
            
            const navItem = e.target.closest('.nav-item');
            if (navItem) {
                this.handleNavClick(navItem);
                return;
            }
        });
        
        // 프로모션 배너 클릭
        const promoBanner = document.querySelector('.promotion-banner');
        if (promoBanner) {
            promoBanner.addEventListener('click', () => {
                this.showToast('🎯 특별 혜택 페이지로 이동합니다!');
            });
        }
    }
    
    showMainScreen() {
        const onboarding = document.getElementById('onboarding');
        const main = document.getElementById('main');
        
        if (onboarding && main) {
            onboarding.classList.add('hidden');
            main.classList.add('active');
            this.currentView = 'main';
            
            // 메인 화면 데이터 로드
            setTimeout(() => {
                this.loadRestaurantData();
            }, 500);
        }
    }
    
    async handleSearch(query) {
        if (!query || query.trim().length < 2) {
            return;
        }
        
        this.showLoading('검색 중...');
        
        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query.trim() })
            });
            
            if (!response.ok) {
                throw new Error('검색 요청 실패');
            }
            
            const data = await response.json();
            this.displaySearchResults(data.results || []);
            
        } catch (error) {
            console.error('검색 오류:', error);
            this.showToast('검색 중 오류가 발생했습니다.');
        } finally {
            this.hideLoading();
        }
    }
    
    handleCategoryClick(category) {
        console.log('카테고리 선택:', category);
        this.showToast(`${category} 카테고리를 선택했습니다`);
        
        // 선택 효과
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        const selectedItem = document.querySelector(`[data-category="${category}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
            setTimeout(() => {
                selectedItem.classList.remove('selected');
            }, 300);
        }
        
        // 카테고리별 검색
        this.handleSearch(category);
    }
    
    handleRestaurantClick(card) {
        const restaurantName = card.querySelector('h3').textContent;
        console.log('레스토랑 선택:', restaurantName);
        
        this.showRestaurantModal(restaurantName);
    }
    
    handleNavClick(navItem) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        navItem.classList.add('active');
        
        const label = navItem.querySelector('.nav-label').textContent;
        console.log('네비게이션 선택:', label);
        
        switch(label) {
            case '맛집지도':
                this.showToast('🗺️ 맛집지도로 이동합니다');
                break;
            case '홈':
                this.showToast('🏠 홈으로 이동했습니다');
                break;
            case '마이페이지':
                this.showToast('👤 마이페이지로 이동합니다');
                break;
        }
    }
    
    async loadRestaurantData() {
        try {
            this.loadTodayRecommendations();
            this.loadFavoriteRestaurants();
            this.loadBlueRibbonRestaurants();
        } catch (error) {
            console.error('데이터 로드 오류:', error);
        }
    }
    
    async loadTodayRecommendations() {
        const container = document.getElementById('todayRecommendations');
        if (!container) return;
        
        const sampleData = [
            {
                name: '짬뽕관 광주송정선운점',
                distance: '450m',
                location: '광주 광산구 소촌동',
                rating: 4.9,
                reviews: 600,
                minOrder: '13,000원'
            },
            {
                name: '맛나곱창 본점',
                distance: '680m',
                location: '광주 광산구 송정동',
                rating: 4.7,
                reviews: 423,
                minOrder: '15,000원'
            },
            {
                name: '김밥천국 송정점',
                distance: '320m',
                location: '광주 광산구 소촌동',
                rating: 4.5,
                reviews: 234,
                minOrder: '8,000원'
            }
        ];
        
        this.renderRestaurantCards(container, sampleData);
    }
    
    async loadFavoriteRestaurants() {
        const container = document.getElementById('favoriteRestaurants');
        if (!container) return;
        
        const sampleData = [
            {
                name: '전주콩나물국밥',
                distance: '520m',
                location: '광주 광산구 송정동',
                rating: 4.8,
                reviews: 892,
                minOrder: '7,000원'
            },
            {
                name: '홍콩반점0410',
                distance: '750m',
                location: '광주 광산구 소촌동',
                rating: 4.6,
                reviews: 567,
                minOrder: '12,000원'
            }
        ];
        
        this.renderRestaurantCards(container, sampleData);
    }
    
    async loadBlueRibbonRestaurants() {
        const container = document.getElementById('blueRibbonRecommendations');
        if (!container) return;
        
        const sampleData = [
            {
                name: '송정떡갈비1호점',
                distance: '454m',
                location: '광주 광산구 송정동',
                rating: 5.0,
                reviews: 2263,
                minOrder: '20,000원',
                isBlueRibbon: true
            },
            {
                name: '무등산보리밥',
                distance: '1.2km',
                location: '광주 광산구 송정동',
                rating: 4.9,
                reviews: 1456,
                minOrder: '18,000원',
                isBlueRibbon: true
            }
        ];
        
        this.renderRestaurantCards(container, sampleData, true);
    }
    
    renderRestaurantCards(container, restaurants, isBlueRibbon = false) {
        const gradientClass = isBlueRibbon ? 
            'background: linear-gradient(135deg, #4ECDC4, #44A08D);' : 
            'background: linear-gradient(135deg, #FF9A9E, #FECFEF);';
        
        container.innerHTML = restaurants.map(restaurant => `
            <div class="restaurant-card" data-restaurant="${restaurant.name}">
                <div class="restaurant-image" style="${gradientClass}"></div>
                <div class="restaurant-info">
                    <h3>${restaurant.name}</h3>
                    <div class="restaurant-details">
                        <span class="distance">${restaurant.distance}</span>
                        <span class="location">${restaurant.location}</span>
                    </div>
                    <div class="rating-info">
                        <div class="rating">
                            <div class="star filled"></div>
                            <span class="rating-text">${restaurant.rating} (${restaurant.reviews})</span>
                        </div>
                        <span class="min-order">최소 주문: ${restaurant.minOrder}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    displaySearchResults(results) {
        console.log('검색 결과:', results);
        
        if (results.length === 0) {
            this.showToast('검색 결과가 없습니다.');
            return;
        }
        
        const container = document.getElementById('todayRecommendations');
        if (container) {
            this.renderRestaurantCards(container, results.slice(0, 3));
        }
        
        this.showToast(`${results.length}개의 맛집을 찾았습니다.`);
    }
    
    showRestaurantModal(restaurantName) {
        const modal = document.createElement('div');
        modal.className = 'restaurant-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${restaurantName}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>레스토랑 상세 정보가 여기에 표시됩니다.</p>
                    <div class="modal-actions">
                        <button class="btn-primary">주문하기</button>
                        <button class="btn-secondary">즐겨찾기</button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        const content = modal.querySelector('.modal-content');
        content.style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 24px;
            max-width: 300px;
            width: 100%;
            text-align: center;
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('.modal-close');
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (modal.parentNode) {
                    document.body.removeChild(modal);
                }
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        modal.querySelector('.btn-primary').addEventListener('click', () => {
            this.showToast('🛒 주문 페이지로 이동합니다');
            closeModal();
        });
        
        modal.querySelector('.btn-secondary').addEventListener('click', () => {
            this.showToast('⭐ 즐겨찾기에 추가되었습니다');
            closeModal();
        });
    }
    
    showLoading(message = '로딩 중...') {
        this.isLoading = true;
        const existingLoader = document.querySelector('.app-loader');
        if (existingLoader) return;
        
        const loader = document.createElement('div');
        loader.className = 'app-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loading"></div>
                <div class="loader-message">${message}</div>
            </div>
        `;
        
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.9);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(loader);
    }
    
    hideLoading() {
        this.isLoading = false;
        const loader = document.querySelector('.app-loader');
        if (loader) {
            loader.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 300);
        }
    }
    
    showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'app-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 12px 20px;
            border-radius: 20px;
            z-index: 10000;
            font-size: 14px;
            max-width: 280px;
            text-align: center;
            animation: slideInDown 0.3s ease;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutUp 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    async loadInitialData() {
        try {
            console.log('초기 데이터 로딩 시작');
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log('사용자 위치:', latitude, longitude);
                    },
                    (error) => {
                        console.log('위치 정보 접근 거부됨:', error.message);
                    }
                );
            }
            
            this.loadPopularKeywords();
            
        } catch (error) {
            console.error('초기 데이터 로드 실패:', error);
        }
    }
    
    async loadPopularKeywords() {
        try {
            const response = await fetch('/api/search/popular');
            const data = await response.json();
            
            if (data.success && data.keywords) {
                console.log('인기 검색어:', data.keywords);
            }
        } catch (error) {
            console.error('인기 검색어 로드 실패:', error);
        }
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', function() {
    window.figmaApp = new FigmaApp();
    
    // 글로벌 에러 핸들링
    window.addEventListener('error', (e) => {
        console.error('앱 에러:', e.error);
        if (window.figmaApp) {
            window.figmaApp.showToast('앱에서 오류가 발생했습니다.');
        }
    });
    
    // 네트워크 상태 모니터링
    window.addEventListener('online', () => {
        if (window.figmaApp) {
            window.figmaApp.showToast('🌐 인터넷에 연결되었습니다');
        }
    });
    
    window.addEventListener('offline', () => {
        if (window.figmaApp) {
            window.figmaApp.showToast('📱 오프라인 모드입니다');
        }
    });
});
