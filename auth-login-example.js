    // 실제 API 인증 버전의 로그인 처리
    async handleLoginWithAPI(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            this.showToast('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        this.showLoading('로그인 중...');

        try {
            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                this.showScreen(2);
                this.showToast(data.message);
            } else {
                this.showToast(data.message);
            }
        } catch (error) {
            console.error('로그인 에러:', error);
            this.showToast('로그인 중 오류가 발생했습니다.');
        } finally {
            this.hideLoading();
        }
    }