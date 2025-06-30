// API 통신을 위한 함수
const api = {
    // 토큰 가져오기
    getToken: () => {
        return localStorage.getItem('token');
    },

    // 토큰 저장하기
    setToken: (token) => {
        localStorage.setItem('token', token);
    },

    // 토큰 삭제하기
    removeToken: () => {
        localStorage.removeItem('token');
    },

    // API 요청 보내기
    async request(url, options = {}) {
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'API 요청 실패');
            }

            // 응답이 없는 경우 (204 No Content)
            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('API 요청 오류:', error);
            throw error;
        }
    },

    // GET 요청
    get(url, params = {}) {
        const queryString = Object.keys(params)
            .filter(key => params[key] !== undefined && params[key] !== null)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');

        const requestUrl = queryString ? `${url}?${queryString}` : url;

        return this.request(requestUrl, {
            method: 'GET'
        });
    },

    // POST 요청
    post(url, data = {}) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // PUT 요청
    put(url, data = {}) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // DELETE 요청
    delete(url) {
        return this.request(url, {
            method: 'DELETE'
        });
    }
};

// 레스토랑 관련 API
const restaurantApi = {
    // 인기 레스토랑 가져오기
    getTopRatedRestaurants: async (userId) => {
        return api.get('/api/restaurants/top-rated', { userId });
    },

    // 블루리본 레스토랑 가져오기
    getBlueRibbonRestaurants: async (userId) => {
        return api.get('/api/restaurants/blue-ribbon', { userId });
    },

    // 주변 레스토랑 가져오기
    getNearbyRestaurants: async (latitude, longitude, distance, userId) => {
        return api.get('/api/restaurants/nearby', {
            latitude,
            longitude,
            distance,
            userId
        });
    },

    // 레스토랑 검색하기
    searchRestaurants: async (keyword, userId) => {
        return api.get('/api/restaurants/search', { keyword, userId });
    },

    // 즐겨찾기 레스토랑 가져오기
    getFavoriteRestaurants: async (userId) => {
        return api.get('/api/restaurants/favorites', { userId });
    },

    // 레스토랑 상세 정보 가져오기
    getRestaurantById: async (restaurantId, userId) => {
        return api.get(`/api/restaurants/${restaurantId}`, { userId });
    },

    // 즐겨찾기 토글하기
    toggleFavorite: async (restaurantId, userId) => {
        return api.post(`/api/restaurants/${restaurantId}/favorite`, { userId });
    }
};

// 사용자 관련 API
const userApi = {
    // 사용자 정보 가져오기
    getUserInfo: async () => {
        return api.get('/api/users/me');
    },

    // 사용자 정보 업데이트하기
    updateUserInfo: async (userData) => {
        return api.put('/api/users/me', userData);
    }
};
