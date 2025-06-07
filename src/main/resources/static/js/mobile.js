// 전역 변수
let currentScreen = 'splash';
let selectedCategory = '';

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
    localStorage.setItem('userInfo', JSON.stringify({
        nickname, password, location, selectedCategory
    }));

    showToast('설정이 완료되었습니다. 맛집을 찾는 중...');
    showScreen('results');
    loadRestaurants();
}

// 레스토랑 데이터 로드
async function loadRestaurants() {
    try {
        showToast('추천 맛집을 찾는 중...');
        
        // 먼저 AI 키워드 가져오기 시도
        try {
            const keywordsResponse = await fetch('/api/v1/search/ai/keywords?limit=5');
            if (keywordsResponse.ok) {
                const keywordsData = await keywordsResponse.json();
                
                if (keywordsData.keywords && keywordsData.keywords.length > 0) {
                    // AI 추천 시도
                    try {
                        const keywords = keywordsData.keywords.slice(0,3).join(',');
                        const recommendResponse = await fetch(`/api/v1/search/ai/recommend?keywords=${encodeURIComponent(keywords)}`);
                        
                        if (recommendResponse.ok) {
                            const recommendData = await recommendResponse.json();
                            if (recommendData.items && recommendData.items.length > 0) {
                                displayRestaurants(recommendData.items);
                                return; // AI 추천 성공 시 종료
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
        
        // AI 추천 실패 시 일반 검색으로 폴백
        showToast('AI 추천이 어려워 일반 검색으로 찾아드릴게요!');
        const searchQuery = selectedCategory || '맛집';
        const searchResponse = await fetch(`/api/v1/search?type=local&q=${encodeURIComponent(searchQuery)}`);
        
        if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            displayRestaurants(searchData.items || []);
        } else {
            // 일반 검색도 실패 시 DB 검색 시도
            const dbResponse = await fetch(`/api/v1/search?type=db&q=${encodeURIComponent(searchQuery)}`);
            if (dbResponse.ok) {
                const dbData = await dbResponse.json();
                displayRestaurants(dbData.items || []);
            } else {
                displayRestaurants([]);
            }
        }
        
    } catch (error) {
        console.error('데이터 로드 실패:', error);
        showToast('맛집 정보를 불러오지 못했습니다. 다시 시도해주세요.');
        displayRestaurants([]);
    }
}

// 레스토랑 목록 표시
function displayRestaurants(restaurants) {
    const restaurantList = document.getElementById('restaurantList');
    const featuredList = document.getElementById('featuredList');
    
    if (!restaurants || restaurants.length === 0) {
        const noResultsHtml = '<p style="text-align: center; color: #666; padding: 2rem;">검색 결과가 없습니다.</p>';
        restaurantList.innerHTML = noResultsHtml;
        featuredList.innerHTML = noResultsHtml;
        return;
    }

    const half = Math.ceil(restaurants.length / 2);
    const firstHalf = restaurants.slice(0, half);
    const secondHalf = restaurants.slice(half);

    restaurantList.innerHTML = renderRestaurantCards(firstHalf);
    featuredList.innerHTML = renderRestaurantCards(secondHalf);
}

// 레스토랑 카드 렌더링
function renderRestaurantCards(restaurants) {
    return restaurants.map(restaurant => {
        const name = restaurant.title || restaurant.bizName || '이름 없음';
        const address = restaurant.address || restaurant.roadAddr || '주소 없음';
        const rating = restaurant.naverRating ? `${restaurant.naverRating.toFixed(1)} ⭐` : '평점 없음';
        const category = restaurant.category || restaurant.foodType || restaurant.mainFood || '';
        
        let imageContent = '🍽️';
        if (restaurant.imageLinks && restaurant.imageLinks[0]) {
            imageContent = `<img src="${restaurant.imageLinks[0]}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        }

        return `
            <div class="restaurant-card" onclick="showRestaurantDetail('${name}', '${address}', '${rating}')">
                <div class="restaurant-image">${imageContent}</div>
                <div class="restaurant-info">
                    <div class="restaurant-name">${name}</div>
                    <div class="restaurant-rating">${rating} ${category ? '• ' + category : ''}</div>
                    <div class="restaurant-distance">${address}</div>
                </div>
            </div>
        `;
    }).join('');
}

// 레스토랑 상세 정보 표시
function showRestaurantDetail(name, address, rating) {
    showToast(`${name} 상세 정보를 보여드립니다.`);
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
        } catch (error) {
            console.error('사용자 정보 복원 실패:', error);
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