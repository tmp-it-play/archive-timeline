// Figma 모바일 앱 JavaScript - 로그인 제거 버전
class FigmaMobileApp {
    constructor() {
        this.currentScreen = 0;
        this.screens = ['onboarding', 'main'];  // 로그인 화면 제거
        this.restaurants = [];
        this.apiBase = window.location.origin + '/api';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.startOnboardingTimer();
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 검색바 이벤트
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(searchInput.value);
                }
            });
            
            // 실시간 검색 제안
            searchInput.addEventListener('input', (e) => {
                this.debounce(() => this.showSearchSuggestions(e.target.value), 300);
            });
        }

        // 카테고리 클릭 이벤트
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => {
                const category = item.dataset.category;
                this.handleCategoryClick(category);
            });
        });

        // 네비게이션 클릭 이벤트
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // 온보딩 화면 클릭 이벤트
        const onboardingScreen = document.getElementById('onboarding');
        if (onboardingScreen) {
            onboardingScreen.addEventListener('click', () => this.showMainScreen());
        }
    }

    // 디바운스 함수
    debounce(func, wait) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(func, wait);
    }

    // 온보딩 자동 전환 타이머 (바로 메인으로)
    startOnboardingTimer() {
        setTimeout(() => {
            this.showMainScreen();
        }, 3000);
    }

    // 메인 화면 표시
    showMainScreen() {
        const onboarding = document.getElementById('onboarding');
        const main = document.getElementById('main');
        
        if (onboarding) {
            onboarding.classList.add('hidden');
        }
        
        if (main) {
            main.classList.add('active');
            this.loadRestaurants();
        }
        
        this.currentScreen = 1;
    }

    // 검색 처리
    async handleSearch(query) {
        if (!query.trim()) return;

        this.showLoading('검색 중...');
        
        try {
            const response = await fetch(`${this.apiBase}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.displaySearchResults(data.results, query);
            } else {
                throw new Error('검색 실패');
            }
        } catch (error) {
            console.error('검색 에러:', error);
            this.showToast(`"${query}" 검색 중 오류가 발생했습니다.`);
        } finally {
            this.hideLoading();
        }
    }

    // 검색 제안 표시
    async showSearchSuggestions(query) {
        if (!query.trim()) return;

        try {
            const response = await fetch(`${this.apiBase}/search/suggestions?query=${encodeURIComponent(query)}`);
            if (response.ok) {
                const data = await response.json();
                console.log('검색 제안:', data.suggestions);
            }
        } catch (error) {
            console.error('검색 제안 에러:', error);
        }
    }

    // 카테고리 클릭 처리
    async handleCategoryClick(category) {
        this.showLoading(`${category} 맛집 검색 중...`);
        
        try {
            const response = await fetch(`${this.apiBase}/restaurants?category=${encodeURIComponent(category)}`);
            if (response.ok) {
                const restaurants = await response.json();
                this.displayCategoryResults(category, restaurants);
            } else {
                throw new Error('카테고리 검색 실패');
            }
        } catch (error) {
            console.error('카테고리 검색 에러:', error);
            this.showToast(`${category} 카테고리 검색 중 오류가 발생했습니다.`);
        } finally {
            this.hideLoading();
        }
    }

    // 네비게이션 클릭 처리
    handleNavClick(e) {
        e.preventDefault();
        
        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });
        
        e.currentTarget.classList.add('active');
        
        const navText = e.currentTarget.querySelector('.nav-label').textContent;
        
        switch(navText) {
            case '홈':
                this.loadRestaurants();
                break;
            case '맛집지도':
                this.showToast('맛집지도 페이지로 이동합니다.');
                break;
            case '마이페이지':
                this.showToast('마이페이지로 이동합니다.');
                break;
        }
    }

    // 초기 데이터 로드
    loadInitialData() {
        this.restaurants = [
            {
                id: 1,
                name: "짬뽕관 광주송정선운점",
                distance: "450m",
                location: "광주 광산구 소촌동",
                rating: 4.9,
                reviews: 600,
                minOrder: "13,000원",
                image: "🍜",
                category: "중식"
            },
            {
                id: 2,
                name: "송정떡갈비1호점",
                distance: "454m", 
                location: "광주 광산구 송정동",
                rating: 5.0,
                reviews: 2263,
                minOrder: "20,000원",
                image: "🥩",
                category: "한식"
            },
            {
                id: 3,
                name: "맛있는 피자집",
                distance: "320m",
                location: "광주 광산구 소촌동",
                rating: 4.7,
                reviews: 856,
                minOrder: "15,000원",
                image: "🍕",
                category: "양식"
            },
            {
                id: 4,
                name: "행복한 초밥집",
                distance: "680m",
                location: "광주 광산구 송정동",
                rating: 4.8,
                reviews: 432,
                minOrder: "25,000원",
                image: "🍣",
                category: "일식"
            },
            {
                id: 5,
                name: "카페 민쏠",
                distance: "230m",
                location: "광주 광산구 소촌동",
                rating: 4.6,
                reviews: 289,
                minOrder: "8,000원",
                image: "☕",
                category: "카페"
            },
            {
                id: 6,
                name: "황금 치킨",
                distance: "520m",
                location: "광주 광산구 송정동",
                rating: 4.5,
                reviews: 1024,
                minOrder: "12,000원",
                image: "🍗",
                category: "치킨"
            }
        ];
    }

    // 레스토랑 데이터 로드 (API 호출)
    async loadRestaurants() {
        try {
            const [todayRecs, favorites, blueRibbon] = await Promise.all([
                this.fetchRecommendations('/restaurants/today'),
                this.fetchRecommendations('/restaurants/favorites'),
                this.fetchRecommendations('/restaurants/blue-ribbon')
            ]);

            this.renderRestaurantSection('todayRecommendations', todayRecs);
            this.renderRestaurantSection('favoriteRestaurants', favorites);
            this.renderRestaurantSection('blueRibbonRecommendations', blueRibbon);

        } catch (error) {
            console.error('레스토랑 데이터 로딩 실패:', error);
            this.renderRestaurants();
        }
    }

    // API에서 추천 데이터 가져오기
    async fetchRecommendations(endpoint) {
        try {
            const response = await fetch(`${this.apiBase}${endpoint}`);
            if (response.ok) {
                return await response.json();
            }
            throw new Error(`API 호출 실패: ${endpoint}`);
        } catch (error) {
            console.error(`추천 데이터 로딩 실패 ${endpoint}:`, error);
            return this.restaurants;
        }
    }

    // 레스토랑 카드 생성
    createRestaurantCard(restaurant) {
        return `
            <div class="restaurant-card fade-in" onclick="app.showRestaurantDetail(${restaurant.id})">
                <div class="restaurant-image">${restaurant.image}</div>
                <div class="restaurant-info">
                    <h3>${restaurant.name}</h3>
                    <div class="restaurant-details">
                        <span class="distance">${restaurant.distance}</span>
                        <span class="location">${restaurant.location}</span>
                    </div>
                    <div class="rating-info">
                        <div class="rating">
                            <span class="star">★</span>
                            <span class="rating-text">${restaurant.rating} (${restaurant.reviews})</span>
                        </div>
                        <div class="min-order">최소 주문: ${restaurant.minOrder}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // 특정 섹션에 레스토랑 렌더링
    renderRestaurantSection(sectionId, restaurants) {
        const container = document.getElementById(sectionId);
        if (container && restaurants && restaurants.length > 0) {
            container.innerHTML = restaurants.map(restaurant => 
                this.createRestaurantCard(restaurant)
            ).join('');
        }
    }

    // 모든 섹션에 레스토랑 목록 렌더링
    renderRestaurants() {
        const sections = [
            'todayRecommendations',
            'favoriteRestaurants', 
            'blueRibbonRecommendations'
        ];

        sections.forEach(sectionId => {
            this.renderRestaurantSection(sectionId, this.restaurants);
        });
    }

    // 레스토랑 상세 정보 표시
    async showRestaurantDetail(restaurantId) {
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
            const restaurant = this.restaurants.find(r => r.id === restaurantId);
            if (restaurant) {
                this.showToast(`${restaurant.name}의 상세 정보를 표시합니다.`);
            }
        }
    }

    // 검색 결과 표시
    displaySearchResults(results, query) {
        console.log(`"${query}" 검색 결과:`, results);
        this.showToast(`"${query}" 검색 결과: ${results.length}개`);
        
        // 첫 번째 섹션에 검색 결과 표시
        this.renderRestaurantSection('todayRecommendations', results);
        
        // 섹션 제목 변경
        const titleElement = document.querySelector('#todayRecommendations').previousElementSibling;
        if (titleElement && titleElement.classList.contains('section-title')) {
            titleElement.textContent = `"${query}" 검색 결과`;
        }
    }

    // 카테고리 결과 표시
    displayCategoryResults(category, restaurants) {
        console.log(`${category} 카테고리 결과:`, restaurants);
        this.showToast(`${category} 카테고리: ${restaurants.length}개 맛집`);
        
        // 첫 번째 섹션에 카테고리 결과 표시
        this.renderRestaurantSection('todayRecommendations', restaurants);
        
        // 섹션 제목 변경
        const titleElement = document.querySelector('#todayRecommendations').previousElementSibling;
        if (titleElement && titleElement.classList.contains('section-title')) {
            titleElement.textContent = `${category} 맛집`;
        }
    }

    // 레스토랑 모달 표시
    displayRestaurantModal(restaurant) {
        const info = `
🏪 ${restaurant.name}
📍 ${restaurant.location}
⭐ ${restaurant.rating}점 (${restaurant.reviews}개 리뷰)
💰 최소 주문: ${restaurant.minOrder}
        `;
        this.showToast(info);
    }

    // 위치 기반 추천
    async loadNearbyRestaurants() {
        try {
            const position = await this.getCurrentLocation();
            const { latitude, longitude } = position.coords;
            
            const response = await fetch(`${this.apiBase}/restaurants/nearby`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ latitude, longitude })
            });
            
            if (response.ok) {
                const restaurants = await response.json();
                this.restaurants = restaurants;
                this.renderRestaurants();
                this.showToast('근처 맛집을 불러왔습니다!');
            }
        } catch (error) {
            console.error('위치 기반 추천 로딩 실패:', error);
            this.showToast('위치 정보를 가져올 수 없습니다.');
            this.renderRestaurants();
        }
    }

    // 현재 위치 가져오기
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            } else {
                reject(new Error('Geolocation is not supported'));
            }
        });
    }

    // 즐겨찾기 토글
    async toggleFavorite(restaurantId) {
        try {
            const response = await fetch(`${this.apiBase}/restaurants/favorite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    restaurantId, 
                    userId: 'guest'
                })
            });

            if (response.ok) {
                const result = await response.json();
                this.showToast(result.favorited ? '즐겨찾기 추가됨' : '즐겨찾기 제거됨');
                return result.favorited;
            }
        } catch (error) {
            console.error('즐겨찾기 토글 실패:', error);
        }

        // 로컬 폴백
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const index = favorites.indexOf(restaurantId);
        
        if (index === -1) {
            favorites.push(restaurantId);
        } else {
            favorites.splice(index, 1);
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        return index === -1;
    }

    // 다크모드 토글
    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        this.showToast(
            document.body.classList.contains('dark-mode') ? 
            '다크모드 활성화' : '라이트모드 활성화'
        );
    }

    // 토스트 메시지 표시
    showToast(message) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 1000;
            max-width: 300px;
            text-align: center;
            transition: opacity 0.3s ease;
            white-space: pre-line;
        `;

        document.body.appendChild(toast);

        setTimeout(() => toast.style.opacity = '1', 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // 로딩 표시
    showLoading(message = '로딩 중...') {
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
            z-index: 2000;
            color: white;
        `;
        loading.innerHTML = `
            <div style="
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #007AFF;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 16px;
            "></div>
            <div>${message}</div>
        `;

        document.body.appendChild(loading);
    }

    // 로딩 숨김
    hideLoading() {
        const loading = document.getElementById('global-loading');
        if (loading) {
            loading.remove();
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

    // 스핀 애니메이션 CSS 추가
    if (!document.querySelector('#spin-animation')) {
        const style = document.createElement('style');
        style.id = 'spin-animation';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
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

function loadNearbyRestaurants() {
    if (app) {
        app.loadNearbyRestaurants();
    }
}

function toggleDarkMode() {
    if (app) {
        app.toggleDarkMode();
    }
}