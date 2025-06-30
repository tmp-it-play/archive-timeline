// app.js - 메인 애플리케이션 JavaScript 파일

/**
 * 앱 초기화 및 전역 설정
 */
(function() {
    'use strict';
    
    console.log('빅데이터 맛집 앱 로딩 완료');
    
    // 전역 앱 객체
    window.app = {
        version: '1.0.0',
        initialized: false,
        
        // 초기화 함수
        init: function() {
            if (this.initialized) return;
            
            console.log('앱 초기화 중...');
            this.setupEventListeners();
            this.checkConnectivity();
            this.initialized = true;
            console.log('앱 초기화 완료');
        },
        
        // 이벤트 리스너 설정
        setupEventListeners: function() {
            // 페이지 로드 이벤트
            document.addEventListener('DOMContentLoaded', function() {
                console.log('DOM 로드 완료');
            });
            
            // 온라인/오프라인 상태 확인
            window.addEventListener('online', function() {
                console.log('온라인 상태');
                app.showToast('인터넷 연결이 복구되었습니다.');
            });
            
            window.addEventListener('offline', function() {
                console.log('오프라인 상태');
                app.showToast('인터넷 연결을 확인해주세요.');
            });
        },
        
        // 연결 상태 확인
        checkConnectivity: function() {
            if (navigator.onLine) {
                console.log('현재 온라인 상태');
            } else {
                console.log('현재 오프라인 상태');
                this.showToast('인터넷 연결을 확인해주세요.');
            }
        },
        
        // 토스트 메시지 표시
        showToast: function(message, duration = 3000) {
            const toast = document.createElement('div');
            toast.className = 'toast-message';
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 10000;
                font-size: 14px;
                max-width: 300px;
                text-align: center;
                animation: fadeInOut ${duration}ms ease-in-out;
            `;
            
            // CSS 애니메이션 추가
            if (!document.querySelector('#toast-style')) {
                const style = document.createElement('style');
                style.id = 'toast-style';
                style.textContent = `
                    @keyframes fadeInOut {
                        0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                        15% { opacity: 1; transform: translateX(-50%) translateY(0); }
                        85% { opacity: 1; transform: translateX(-50%) translateY(0); }
                        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, duration);
        },
        
        // API 요청 헬퍼
        api: {
            baseUrl: '/api',
            
            // GET 요청
            get: function(endpoint) {
                return fetch(`${this.baseUrl}${endpoint}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`API 오류: ${response.status}`);
                        }
                        return response.json();
                    })
                    .catch(error => {
                        console.error('API 요청 실패:', error);
                        app.showToast('데이터 로딩에 실패했습니다.');
                        throw error;
                    });
            },
            
            // POST 요청
            post: function(endpoint, data) {
                return fetch(`${this.baseUrl}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`API 오류: ${response.status}`);
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error('API 요청 실패:', error);
                    app.showToast('요청 처리에 실패했습니다.');
                    throw error;
                });
            }
        },
        
        // 로컬 스토리지 헬퍼
        storage: {
            get: function(key) {
                try {
                    const value = localStorage.getItem(key);
                    return value ? JSON.parse(value) : null;
                } catch (error) {
                    console.error('로컬 스토리지 읽기 오류:', error);
                    return null;
                }
            },
            
            set: function(key, value) {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (error) {
                    console.error('로컬 스토리지 쓰기 오류:', error);
                    return false;
                }
            },
            
            remove: function(key) {
                try {
                    localStorage.removeItem(key);
                    return true;
                } catch (error) {
                    console.error('로컬 스토리지 삭제 오류:', error);
                    return false;
                }
            }
        }
    };
    
    // 앱 자동 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.app.init();
        });
    } else {
        window.app.init();
    }
    
})();
