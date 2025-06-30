/**
 * 빅데이터 맛집 앱 JavaScript
 * Figma 디자인에 맞춘 기능 구현
 */

// 전역 변수
let currentScreen = 'splash';
let selectedCategory = null;
let currentRestaurantId = null;
let favorites = new Set();
let userData = {
    nickname: '사용자',
    location: '광주광역시',
    lastVisit: new Date()
};

// DOM 요소
const splashScreen = document.getElementById('splash');
const mainScreen = document.getElementById('main');
const mapScreen = document.getElementById('map');
const mypageScreen = document.getElementById('mypage');
const restaurantModal = document.getElementById('restaurantModal');
const closeModalBtn = document.getElementById('closeModal');
const toast = document.getElementById('toast');

// 현재 시간 표시
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    document.querySelector('.time').textContent = timeString;
}

// 초기화 함수
function init() {
    // 시간 업데이트
    updateTime();
    setInterval(updateTime, 60000);

    // 스플래시 화면 자동 전환
    setTimeout(() => {
        showScreen('main');
    }, 3000);

    // 이벤트 리스너 등록
    registerEventListeners();

    // 음식점 데이터 로드
    loadRestaurants();

    // 사용자 데이터 로드
    loadUserData();
}

// 화면 전환 함수
function showScreen(screenId) {
    // 현재 화면 숨기기
    if (currentScreen === 'splash') {
        splashScreen.classList.add('hidden');
    } else if (currentScreen === 'main') {
        mainScreen.classList.remove('active');
    } else if (currentScreen === 'map') {
        mapScreen.classList.remove('active');
    } else if (currentScreen === 'mypage') {
        mypageScreen.classList.remove('active');
    }

    // 새 화면 표시
    if (screenId === 'main') {
        mainScreen.classList.add('active');
    } else if (screenId === 'map') {
        mapScreen.classList.add('active');
    } else if (screenId === 'mypage') {
        mypageScreen.classList.add('active');
    }

    // 현재 화면 업데이트
    currentScreen = screenId;

    // 하단 네비게이션 활성화 상태 업데이트
    updateNavigation();
}

// 하단 네비게이션 업데이트
function updateNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    // 현재 화면에 맞는 네비게이션 활성화
    let activeNav;
    if (currentScreen === 'main') {
        activeNav = document.querySelector('.nav-item:nth-child(2)'); // 홈 버튼
    } else if (currentScreen === 'map') {
        activeNav = document.querySelector('.nav-item:nth-child(1)'); // 맛집지도 버튼
    } else if (currentScreen === 'mypage') {
        activeNav = document.querySelector('.nav-item:nth-child(3)'); // 마이페이지 버튼
    }

    if (activeNav) {
        activeNav.classList.add('active');
    }
}

// 이벤트 리스너 등록
function registerEventListeners() {
    // 스플래시 화면 클릭 시 메인 화면으로
    splashScreen.addEventListener('click', () => {
        showScreen('main');
    });

    // 하단 네비게이션 이벤트
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const index = Array.from(navItems).indexOf(item);
            
            if (index === 0) {
                showScreen('map');
            } else if (index === 1) {
                showScreen('main');
            } else if (index === 2) {
                showScreen('mypage');
            }
        });
    });

    // 뒤로가기 버튼 이벤트
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            showScreen('main');
        });
    });

    // 레스토랑 카드 클릭 이벤트
    const restaurantCards = document.querySelectorAll('.restaurant-card');
    restaurantCards.forEach(card => {
        card.addEventListener('click', () => {
            const restaurantName = card.querySelector('.restaurant-name').textContent;
            const restaurantAddress = card.querySelector('.address').textContent;
            const restaurantRating = card.querySelector('.rating span').textContent;
            
            showRestaurantDetail(restaurantName, restaurantAddress, restaurantRating);
        });
    });

    // 모달 닫기 버튼
    closeModalBtn.addEventListener('click', () => {
        restaurantModal.classList.remove('active');
    });

    // 모달 외부 클릭 시 닫기
    restaurantModal.addEventListener('click', (e) => {
        if (e.target === restaurantModal) {
            restaurantModal.classList.remove('active');
        }
    });

    // 카테고리 아이템 클릭 이벤트
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            const category = item.getAttribute('data-category');
            selectedCategory = category;
            showToast(`${category} 카테고리를 선택했습니다`);
            searchByCategory(category);
        });
    });

    // 검색 입력 이벤트
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                showToast(`'${searchTerm}' 검색 결과`);
                searchRestaurants(searchTerm);
                searchInput.value = '';
            }
        }
    });
}

// 토스트 메시지 표시
function showToast(message, duration = 3000) {
    const toastContent = document.querySelector('.toast-content');
    if (toastContent) {
        toastContent.textContent = message;
    } else {
        toast.textContent = message;
    }
    
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, duration);
}

// 음식점 상세 정보 표시
function showRestaurantDetail(name, address, rating) {
    // 모달 내용 업데이트
    document.querySelector('.restaurant-detail-name').textContent = name;
    document.querySelector('.rating-value').textContent = rating.split(' ')[0];
    document.querySelector('.rating-count').textContent = rating.split(' ')[1] || '';
    document.querySelector('.meta-icon.location').nextElementSibling.textContent = address;
    
    // 샘플 데이터 (실제로는 API에서 받아와야 함)
    document.querySelector('.meta-icon.phone').nextElementSibling.textContent = '062-123-4567';
    document.querySelector('.meta-icon.time').nextElementSibling.textContent = '10:00 - 22:00';
    document.querySelector('.meta-icon.category').nextElementSibling.textContent = selectedCategory || '한식';
    
    // 모달 표시
    restaurantModal.classList.add('active');
    
    // 현재 음식점 ID 저장 (실제로는 API에서 받아와야 함)
    currentRestaurantId = name;
}

// 음식점 데이터 로드
async function loadRestaurants() {
    try {
        // 실제로는 API 호출 필요
        // const response = await fetch('/api/v1/restaurants');
        // const data = await response.json();
        
        // 샘플 데이터로 대체
        const data = getSampleRestaurants();
        
        // 각 섹션에 맞게 음식점 데이터 표시
        renderRestaurants('localRecommendations', data.local);
        renderRestaurants('favorites', data.favorites);
        renderRestaurants('blueRibbonRecommendations', data.blueRibbon);
        
    } catch (error) {
        console.error('음식점 데이터 로드 실패:', error);
        showToast('음식점 정보를 불러오는데 실패했습니다.');
    }
}

// 카테고리별 음식점 검색
function searchByCategory(category) {
    try {
        // 실제로는 API 호출 필요
        // const response = await fetch(`/api/v1/restaurants?category=${category}`);
        // const data = await response.json();
        
        // 샘플 데이터로 대체
        const data = getSampleRestaurants().filtered;
        
        // 검색 결과 표시
        renderRestaurants('localRecommendations', data);
        
    } catch (error) {
        console.error('카테고리 검색 실패:', error);
        showToast('검색에 실패했습니다.');
    }
}

// 음식점 검색
function searchRestaurants(keyword) {
    try {
        // 실제로는 API 호출 필요
        // const response = await fetch(`/api/v1/restaurants?keyword=${keyword}`);
        // const data = await response.json();
        
        // 샘플 데이터로 대체
        const data = getSampleRestaurants().filtered;
        
        // 검색 결과 표시
        renderRestaurants('localRecommendations', data);
        
    } catch (error) {
        console.error('음식점 검색 실패:', error);
        showToast('검색에 실패했습니다.');
    }
}

// 음식점 목록 렌더링
function renderRestaurants(sectionId, restaurants) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    if (!restaurants || restaurants.length === 0) {
        section.innerHTML = `
            <div class="empty-state">
                <p>음식점 정보가 없습니다.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    restaurants.forEach(restaurant => {
        const isBlueRibbon = sectionId === 'blueRibbonRecommendations';
        
        html += `
            <div class="restaurant-card" data-id="${restaurant.id}">
                <div class="restaurant-image ${isBlueRibbon ? 'blue-ribbon' : ''}"></div>
                <div class="restaurant-info">
                    <h3 class="restaurant-name">${restaurant.name}</h3>
                    <div class="restaurant-meta">
                        <span class="distance">${restaurant.distance}</span>
                        <span class="address">${restaurant.address}</span>
                    </div>
                    <div class="restaurant-details">
                        <div class="rating">
                            <div class="star-icon ${isBlueRibbon ? 'blue' : ''}"></div>
                            <span>${restaurant.rating} (${restaurant.reviewCount})</span>
                        </div>
                        <div class="min-order">최소 주문: ${restaurant.minOrder}</div>
                    </div>
                </div>
            </div>
        `;
    });
    
    section.innerHTML = html;
    
    // 이벤트 리스너 다시 등록
    const restaurantCards = section.querySelectorAll('.restaurant-card');
    restaurantCards.forEach(card => {
        card.addEventListener('click', () => {
            const restaurantName = card.querySelector('.restaurant-name').textContent;
            const restaurantAddress = card.querySelector('.address').textContent;
            const restaurantRating = card.querySelector('.rating span').textContent;
            
            showRestaurantDetail(restaurantName, restaurantAddress, restaurantRating);
        });
    });
}

// 사용자 데이터 로드
function loadUserData() {
    try {
        // 로컬 스토리지에서 사용자 데이터 로드
        const savedData = localStorage.getItem('bigdataUserData');
        if (savedData) {
            userData = JSON.parse(savedData);
            
            // 마이페이지 정보 업데이트
            const profileName = document.querySelector('.profile-name');
            const profileMeta = document.querySelector('.profile-meta');
            
            if (profileName) profileName.textContent = userData.nickname;
            if (profileMeta) profileMeta.textContent = userData.location;
        }
        
        // 즐겨찾기 데이터 로드
        const savedFavorites = localStorage.getItem('bigdataFavorites');
        if (savedFavorites) {
            favorites = new Set(JSON.parse(savedFavorites));
        }
    } catch (error) {
        console.error('사용자 데이터 로드 실패:', error);
    }
}

// 사용자 데이터 저장
function saveUserData() {
    try {
        localStorage.setItem('bigdataUserData', JSON.stringify(userData));
        localStorage.setItem('bigdataFavorites', JSON.stringify([...favorites]));
    } catch (error) {
        console.error('사용자 데이터 저장 실패:', error);
    }
}

// 샘플 음식점 데이터
function getSampleRestaurants() {
    return {
        local: [
            {
                id: 'r1',
                name: '짬뽕관 광주송정선운점',
                address: '광주 광산구 소촌동',
                distance: '450m',
                rating: '4.9',
                reviewCount: '600',
                minOrder: '13,000원',
                category: '중식'
            },
            {
                id: 'r2',
                name: '맛있는 돈까스',
                address: '광주 광산구 송정동',
                distance: '350m',
                rating: '4.7',
                reviewCount: '450',
                minOrder: '10,000원',
                category: '일식'
            },
            {
                id: 'r3',
                name: '홍콩반점',
                address: '광주 광산구 송정동',
                distance: '530m',
                rating: '4.5',
                reviewCount: '380',
                minOrder: '15,000원',
                category: '중식'
            }
        ],
        favorites: [
            {
                id: 'r4',
                name: '맘스터치',
                address: '광주 광산구 소촌동',
                distance: '450m',
                rating: '4.6',
                reviewCount: '800',
                minOrder: '12,000원',
                category: '햄버거'
            },
            {
                id: 'r5',
                name: '백채김치찌개',
                address: '광주 광산구 송정동',
                distance: '650m',
                rating: '4.8',
                reviewCount: '520',
                minOrder: '8,000원',
                category: '한식'
            },
            {
                id: 'r6',
                name: '서브웨이',
                address: '광주 광산구 송정동',
                distance: '750m',
                rating: '4.4',
                reviewCount: '320',
                minOrder: '6,000원',
                category: '샌드위치'
            }
        ],
        blueRibbon: [
            {
                id: 'r7',
                name: '송정떡갈비1호점',
                address: '광주 광산구 송정동',
                distance: '454m',
                rating: '5.0',
                reviewCount: '2,263',
                minOrder: '20,000원',
                category: '한식'
            },
            {
                id: 'r8',
                name: '경양식1920',
                address: '광주 광산구 송정동',
                distance: '600m',
                rating: '4.9',
                reviewCount: '1,800',
                minOrder: '25,000원',
                category: '양식'
            },
            {
                id: 'r9',
                name: '명인만두',
                address: '광주 광산구 소촌동',
                distance: '350m',
                rating: '4.8',
                reviewCount: '1,500',
                minOrder: '15,000원',
                category: '중식'
            }
        ],
        filtered: [
            {
                id: 'r10',
                name: '카테고리 검색 결과 1',
                address: '광주 광산구 송정동',
                distance: '450m',
                rating: '4.5',
                reviewCount: '300',
                minOrder: '10,000원',
                category: '한식'
            },
            {
                id: 'r11',
                name: '카테고리 검색 결과 2',
                address: '광주 광산구 소촌동',
                distance: '550m',
                rating: '4.3',
                reviewCount: '250',
                minOrder: '15,000원',
                category: '한식'
            }
        ]
    };
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);

// 뷰포트 높이 설정 (모바일 브라우저 주소창 대응)
function setVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// 뷰포트 높이 설정 및 리사이즈 이벤트 리스너
window.addEventListener('load', setVh);
window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', setVh);

// PWA 설치 관련
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

// 오프라인 감지
window.addEventListener('online', () => {
    showToast('인터넷 연결이 복구되었습니다');
});

window.addEventListener('offline', () => {
    showToast('인터넷 연결이 끊어졌습니다. 일부 기능이 제한될 수 있습니다', 5000);
});
