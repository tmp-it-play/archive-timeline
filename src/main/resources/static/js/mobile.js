// 전역 변수
let currentScreen = 'splash';
let selectedCategory = '';
let userLocation = '';
let favorites = new Set(); // 즐겨찾기 목록
let currentUser = null;
let sortBy = 'relevance'; // 정렬 방식

// 시간 업데이트 함수
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
    document.getElementById('current-time').textContent = timeString;
    document.getElementById('results-time').textContent = timeString;
}

// 스플래시 화면 자동 전환
setTimeout(() => {
    showScreen('main');
}, 3000);

// 시간 업데이트 시작
updateTime();
setInterval(updateTime, 1000);

// 토스트 메시지 표시
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// 화면 전환 함수
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        if (screen.id === screenId) {
            screen.classList.remove('hidden', 'prev');
        } else if (screen.id === currentScreen) {
            screen.classList.add('prev');
        } else {
            screen.classList.add('hidden');
        }
    });
    currentScreen = screenId;
}

// 뒤로가기
function goBack() {
    if (currentScreen === 'results') {
        showScreen('main');
    }
}

// 카테고리 선택 이벤트
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
        selectedCategory = item.dataset.category;
        showToast(`${selectedCategory} 카테고리가 선택되었습니다.`);
    });
});

// 레스토랑 검색 함수
function searchRestaurants() {
    const nickname = document.getElementById('nickname').value.trim();
    const password = document.getElementById('password').value.trim();
    const location = document.getElementById('location').value.trim();

    if (!nickname || !password || !location) {
        showToast('모든 정보를 입력해주세요.');
        return;
    }

    // 사용자 정보 저장
    currentUser = nickname;
    userLocation = location;
    localStorage.setItem('userInfo', JSON.stringify({
        nickname, password, location, selectedCategory
    }));

    showToast('설정이 완료되었습니다. 맛집을 찾는 중...');
    showScreen('results');
    loadRestaurants();
}

// 레스토랑 데이터 로드 (향상된 버전)
async function loadRestaurants() {
    try {
        showToast('추천 맛집을 찾는 중...');
        
        // 1. 위치 기반 근처 맛집 먼저 시도
        if (userLocation) {
            try {
                const nearbyResponse = await fetch(`/api/v1/search/nearby?location=${encodeURIComponent(userLocation)}&radius=3.0&sortBy=rating`);
                if (nearbyResponse.ok) {
                    const nearbyData = await nearbyResponse.json();
                    if (nearbyData.items && nearbyData.items.length > 0) {
                        displayRestaurants(nearbyData.items, nearbyData.items.slice(0, Math.ceil(nearbyData.items.length / 2)));
                        loadTrendingRestaurants(); // 별도로 인기 맛집 로드
                        return;
                    }
                }
            } catch (nearbyError) {
                console.warn('근처 맛집 검색 실패:', nearbyError);
            }
        }
        
        // 2. AI 추천 시도
        try {
            const keywordsResponse = await fetch('/api/v1/search/ai/keywords?limit=5');
            if (keywordsResponse.ok) {
                const keywordsData = await keywordsResponse.json();
                
                if (keywordsData.keywords && keywordsData.keywords.length > 0) {
                    try {
                        const keywords = keywordsData.keywords.slice(0,3).join(',');
                        const recommendResponse = await fetch(`/api/v1/search/ai/recommend?keywords=${encodeURIComponent(keywords)}`);
                        
                        if (recommendResponse.ok) {
                            const recommendData = await recommendResponse.json();
                            if (recommendData.items && recommendData.items.length > 0) {
                                displayRestaurants(recommendData.items, []);
                                loadTrendingRestaurants();
                                return;
                            }
                        }
                    } catch (aiError) {
                        console.warn('AI 추천 실패, 일반 검색으로 전환:', aiError);
                    }
                }
            }
        } catch (keywordError) {
            console.warn('AI 키워드 로드 실패:', keywordError);
        }
        
        // 3. 일반 검색으로 폴백
        showToast('AI 추천이 어려워 일반 검색으로 찾아드릴게요!');
        const searchQuery = selectedCategory || '맛집';
        const searchParams = new URLSearchParams({
            type: 'db',
            q: searchQuery,
            sortBy: 'rating'
        });
        
        if (userLocation) {
            searchParams.append('location', userLocation);
        }
        
        const searchResponse = await fetch(`/api/v1/search?${searchParams}`);
        
        if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            displayRestaurants(searchData.items || [], []);
            loadTrendingRestaurants();
        } else {
            // 모든 방법 실패 시 기본 데이터
            displayRestaurants([], []);
        }
        
    } catch (error) {
        console.error('데이터 로드 실패:', error);
        showToast('맛집 정보를 불러오지 못했습니다. 다시 시도해주세요.');
        displayRestaurants([], []);
    }
}

// 인기 맛집 따로 로드
async function loadTrendingRestaurants() {
    try {
        const trendingResponse = await fetch('/api/v1/search/trending?limit=10');
        if (trendingResponse.ok) {
            const trendingData = await trendingResponse.json();
            if (trendingData.items && trendingData.items.length > 0) {
                const featuredList = document.getElementById('featuredList');
                featuredList.innerHTML = renderRestaurantCards(trendingData.items);
            }
        }
    } catch (error) {
        console.warn('인기 맛집 로드 실패:', error);
    }
}

// 레스토랑 목록 표시 (향상된 버전)
function displayRestaurants(restaurants, featuredRestaurants = []) {
    const restaurantList = document.getElementById('restaurantList');
    const featuredList = document.getElementById('featuredList');
    
    if (!restaurants || restaurants.length === 0) {
        const noResultsHtml = '<p style="text-align: center; color: #666; padding: 2rem;">검색 결과가 없습니다.</p>';
        restaurantList.innerHTML = noResultsHtml;
        if (featuredRestaurants.length === 0) {
            featuredList.innerHTML = noResultsHtml;
        }
        return;
    }

    // 첫 번째 섹션: 추천 맛집
    restaurantList.innerHTML = renderRestaurantCards(restaurants);
    
    // 두 번째 섹션: 인기 맛집 (전달된 경우에만)
    if (featuredRestaurants && featuredRestaurants.length > 0) {
        featuredList.innerHTML = renderRestaurantCards(featuredRestaurants);
    }
}

// 레스토랑 카드 렌더링 (향상된 버전)
function renderRestaurantCards(restaurants) {
    return restaurants.map(restaurant => {
        const name = restaurant.title || restaurant.bizName || '이름 없음';
        const address = restaurant.address || restaurant.roadAddr || '주소 없음';
        const rating = restaurant.naverRating ? `${restaurant.naverRating.toFixed(1)} ⭐` : '평점 없음';
        const category = restaurant.category || restaurant.foodType || restaurant.mainFood || '';
        const restaurantId = restaurant.id || Math.random().toString(36).substr(2, 9);
        
        // 즐겨찾기 상태 확인
        const isFavorited = favorites.has(restaurantId);
        const favoriteIcon = isFavorited ? '❤️' : '🤍';
        
        // 거리 정보 (실제로는 GPS 기반 계산)
        const distance = userLocation && address.includes(userLocation) ? '도보 5분' : '';
        
        // 영업 상태 (예시)
        const isOpen = isBusinessOpen();
        const statusBadge = isOpen ? 
            '<span style="color: #4caf50; font-size: 0.8rem;">• 영업중</span>' : 
            '<span style="color: #f44336; font-size: 0.8rem;">• 마감</span>';
        
        let imageContent = '🍽️';
        if (restaurant.imageLinks && restaurant.imageLinks[0]) {
            imageContent = `<img src="${restaurant.imageLinks[0]}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        }

        return `
            <div class="restaurant-card" onclick="showRestaurantDetail('${restaurantId}', '${name}', '${address}', '${rating}')">
                <div class="restaurant-image">${imageContent}</div>
                <div class="restaurant-info">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div class="restaurant-name">${name}</div>
                        <button class="favorite-btn" onclick="event.stopPropagation(); toggleFavorite('${restaurantId}', this)" 
                                style="background: none; border: none; font-size: 1.2rem; cursor: pointer;">
                            ${favoriteIcon}
                        </button>
                    </div>
                    <div class="restaurant-rating">
                        ${rating} ${category ? '• ' + category : ''} ${statusBadge}
                    </div>
                    <div class="restaurant-distance">
                        ${distance ? distance + ' • ' : ''} ${address}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 즐겨찾기 토글
async function toggleFavorite(restaurantId, buttonElement) {
    try {
        const wasFavorited = favorites.has(restaurantId);
        
        if (currentUser) {
            // 서버에 즐겨찾기 상태 전송
            const response = await fetch('/api/v1/search/favorite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: currentUser,
                    restaurantId: restaurantId,
                    isFavorited: wasFavorited
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // 로컬 상태 업데이트
                    if (wasFavorited) {
                        favorites.delete(restaurantId);
                        buttonElement.textContent = '🤍';
                        showToast('즐겨찾기에서 제거되었습니다.');
                    } else {
                        favorites.add(restaurantId);
                        buttonElement.textContent = '❤️';
                        showToast('즐겨찾기에 추가되었습니다.');
                    }
                    
                    // 로컬스토리지에 저장
                    localStorage.setItem('favorites', JSON.stringify([...favorites]));
                }
            }
        }
    } catch (error) {
        console.error('즐겨찾기 토글 실패:', error);
        showToast('잘시 후 다시 시도해주세요.');
    }
}

// 영업 시간 체크 (예시)
function isBusinessOpen() {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 9 && hour < 22; // 9시-22시 영업
}

// 레스토랑 상세 정보 표시 (간단한 버전)
async function showRestaurantDetail(restaurantId, name, address, rating) {
    const modal = document.getElementById('restaurantModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    // 모달 열기
    modalTitle.textContent = name;
    modal.classList.add('show');
    
    // 기본 정보 표시
    modalBody.innerHTML = `
        <div class="detail-section">
            <h4>🏠 기본 정보</h4>
            <div class="detail-info">
                <div class="info-row">
                    <span class="info-label">주소</span>
                    <span class="info-value">${address}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">평점</span>
                    <span class="info-value">${rating}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">영업 상태</span>
                    <span class="info-value">${isBusinessOpen() ? '영업중' : '마감'}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>🚗 편의 시설</h4>
            <div class="facility-list">
                <span class="facility-tag">주차가능</span>
                <span class="facility-tag">WiFi</span>
                <span class="facility-tag">포장가능</span>
                <span class="facility-tag">배달가능</span>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>📍 주변 정보</h4>
            <ul class="nearby-list">
                <li>지하철역 도보 5분</li>
                <li>버스정류장 도보 2분</li>
                <li>공영주차장 이용가능</li>
            </ul>
        </div>
    `;
}

// 모달 닫기
function closeRestaurantModal() {
    const modal = document.getElementById('restaurantModal');
    modal.classList.remove('show');
}

// 메인 검색 이벤트
document.getElementById('mainSearch').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
            selectedCategory = query;
            searchRestaurants();
        }
    }
});

// 결과 화면 검색 이벤트
document.getElementById('resultsSearch').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
            try {
                showToast('검색 중...');
                
                // 일반 검색 먼저 시도
                let response = await fetch(`/api/v1/search?type=local&q=${encodeURIComponent(query)}`);
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.items && data.items.length > 0) {
                        displayRestaurants(data.items);
                        return;
                    }
                }
                
                // 일반 검색 실패 시 DB 검색 시도
                response = await fetch(`/api/v1/search?type=db&q=${encodeURIComponent(query)}`);
                
                if (response.ok) {
                    const data = await response.json();
                    displayRestaurants(data.items || []);
                } else {
                    displayRestaurants([]);
                    showToast('검색 결과가 없습니다.');
                }
                
            } catch (error) {
                console.error('검색 실패:', error);
                showToast('검색에 실패했습니다. 다시 시도해주세요.');
                displayRestaurants([]);
            }
        }
    }
});

// 카테고리 칩 클릭 이벤트
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', async () => {
        const category = chip.dataset.chip;
        try {
            showToast(`${category} 검색 중...`);
            
            // 선택된 칩 스타일 변경
            document.querySelectorAll('.chip').forEach(c => {
                c.style.background = 'white';
                c.style.color = '#333';
            });
            chip.style.background = '#d32f2f';
            chip.style.color = 'white';
            
            // 일반 검색 먼저 시도
            let response = await fetch(`/api/v1/search?type=local&q=${encodeURIComponent(category)}`);
            
            if (response.ok) {
                const data = await response.json();
                if (data.items && data.items.length > 0) {
                    displayRestaurants(data.items);
                    return;
                }
            }
            
            // 일반 검색 실패 시 DB 검색 시도
            response = await fetch(`/api/v1/search?type=db&q=${encodeURIComponent(category)}`);
            
            if (response.ok) {
                const data = await response.json();
                displayRestaurants(data.items || []);
            } else {
                displayRestaurants([]);
                showToast(`${category} 검색 결과가 없습니다.`);
            }
            
        } catch (error) {
            console.error('카테고리 검색 실패:', error);
            showToast('검색에 실패했습니다. 다시 시도해주세요.');
        }
    });
});

// 네비게이션 아이템 클릭 이벤트
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        const navType = item.dataset.nav;
        
        // 현재 화면의 네비게이션 아이템들 가져오기
        const currentNavItems = currentScreen === 'main' ? 
            document.querySelectorAll('#main .nav-item') : 
            document.querySelectorAll('#results .nav-item');
        
        // 활성 상태 변경
        currentNavItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // 네비게이션 처리
        if (navType === 'home') {
            showScreen('main');
        } else if (navType === 'search') {
            if (currentScreen !== 'results') {
                showScreen('results');
                loadRestaurants();
            }
        } else if (navType === 'profile') {
            showToast('마이페이지 기능은 곧 업데이트 예정입니다.');
        }
    });
});

// 터치 제스처 지원
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const threshold = 100;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > threshold) {
        if (swipeDistance > 0 && currentScreen === 'results') {
            // 오른쪽 스와이프 - 뒤로가기
            goBack();
        }
    }
}

// 반응형 뷰포트 조정
function adjustViewport() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', adjustViewport);
window.addEventListener('orientationchange', adjustViewport);
adjustViewport();

// PWA 서비스 워커 등록
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker 등록 성공:', registration);
        })
        .catch(error => {
            console.log('Service Worker 등록 실패:', error);
        });
}

// PWA 설치 프롬프트
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // 설치 버튼 표시
    const installButton = document.createElement('button');
    installButton.textContent = '📱 앱 설치';
    installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #d32f2f;
        color: white;
        border: none;
        padding: 12px 16px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4);
        transition: all 0.2s;
    `;
    
    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            if (choiceResult.outcome === 'accepted') {
                showToast('앱이 설치되었습니다!');
            } else {
                showToast('앱 설치가 취소되었습니다.');
            }
            deferredPrompt = null;
            installButton.remove();
        }
    });
    
    document.body.appendChild(installButton);
    
    // 5초 후에 토스트로 설치 안내
    setTimeout(() => {
        showToast('💡 우하단 버튼을 눌러 앱으로 설치할 수 있습니다!', 5000);
    }, 5000);
});

// 온라인/오프라인 상태 처리
window.addEventListener('online', () => {
    console.log('온라인 상태입니다.');
    showToast('인터넷에 연결되었습니다.');
});

window.addEventListener('offline', () => {
    console.log('오프라인 상태입니다.');
    showToast('인터넷 연결을 확인해주세요.', 5000);
});

// 페이지 가시성 변경 처리 (앱이 백그라운드로 갔다가 돌아올 때)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // 앱이 다시 활성화되었을 때 시간 업데이트
        updateTime();
    }
});

// 키보드 이벤트 처리 (접근성)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentScreen === 'results') {
        goBack();
    }
});

// 초기 로드 시 저장된 사용자 정보 복원
window.addEventListener('load', () => {
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
        try {
            const userInfo = JSON.parse(savedUserInfo);
            document.getElementById('nickname').value = userInfo.nickname || '';
            document.getElementById('location').value = userInfo.location || '';
            selectedCategory = userInfo.selectedCategory || '';
            currentUser = userInfo.nickname || null;
            userLocation = userInfo.location || '';
        } catch (error) {
            console.error('사용자 정보 복원 실패:', error);
        }
    }
    
    // 즐겨찾기 정보 복원
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        try {
            const favoritesList = JSON.parse(savedFavorites);
            favorites = new Set(favoritesList);
        } catch (error) {
            console.error('즐겨찾기 정보 복원 실패:', error);
        }
    }
});

// 디버그 정보 (개발 모드에서만)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🍽️ 민쏠 맛집 탐방 앱이 로드되었습니다.');
    console.log('현재 화면:', currentScreen);
    console.log('사용 가능한 API 엔드포인트:');
    console.log('- /api/v1/search?type=local&q={query}');
    console.log('- /api/v1/search?type=db&q={query}');
    console.log('- /api/v1/search/ai/keywords');
    console.log('- /api/v1/search/ai/recommend?keywords={keywords}');
}