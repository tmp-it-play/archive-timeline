# 🍽️ 맛집지도 - BigData Frontend

내 취향으로 나만의 맛집지도를 만드는 웹 애플리케이션입니다.

## 🚀 주요 기능

### 📱 모바일 최적화 UI
- Figma 디자인 기반 반응형 웹 디자인
- 모바일 우선 설계로 최적화된 사용자 경험
- 직관적인 네비게이션과 사용자 인터페이스

### 🔍 맛집 검색 및 탐색
- **통합 검색**: 업소명, 음식 종류, 지역별 검색
- **카테고리 필터**: 한식, 중식, 일식, 양식 등 다양한 카테고리
- **실시간 검색**: 백엔드 API와 연동된 실시간 검색 결과

### 📊 Data 엔티티 기반 정보
- **실제 데이터**: 서울관광재단 식당품질정보 기반
- **상세 정보**: 업소명, 주소, 음식 유형, 전화번호, 평점 등
- **N/A 처리**: 누락된 데이터에 대한 안전한 처리

### 🏠 홈 화면 섹션
- **오늘의 우리동네 추천**: 주변 맛집 추천
- **평점 높은 맛집**: 4.5점 이상 우수 맛집
- **블루리본 추천**: 4.8점 이상 최고 평점 맛집

### 🔐 Google OAuth 인증
- **소셜 로그인**: Google 계정으로 간편 로그인
- **일반 로그인**: 이메일/비밀번호 로그인 지원
- **게스트 모드**: 비로그인 상태에서도 기본 기능 사용 가능
- **사용자 상태 관리**: 로그인 상태에 따른 UI 변화

## 🛠️ 기술 스택

### Frontend
- **React 19.1.0**: 최신 React로 구성된 컴포넌트 기반 아키텍처
- **Vite 7.0**: 빠른 개발 서버와 빌드 도구
- **Axios 1.10.0**: API 통신을 위한 HTTP 클라이언트
- **CSS3**: 모던 CSS와 Flexbox/Grid 레이아웃

### Development Tools
- **ESLint**: 코드 품질 관리
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **PostCSS**: CSS 후처리기

## 📁 프로젝트 구조

```
src/
├── api/                    # API 통신 관련
│   └── index.js           # 백엔드 API 클라이언트
├── auth/                   # 인증 관련
│   ├── authService.js     # 인증 서비스 클래스
│   └── useAuth.js         # 인증 커스텀 훅
├── components/             # 재사용 가능한 컴포넌트
│   ├── BottomNavigation.jsx
│   ├── FoodCategories.jsx
│   ├── RestaurantCard.jsx
│   ├── RestaurantSection.jsx
│   └── SearchBar.jsx
├── pages/                  # 페이지 컴포넌트
│   ├── HomePage.jsx       # 메인 홈 페이지
│   ├── LoginPage.jsx      # 로그인 페이지
│   └── AuthCallback.jsx   # OAuth 콜백 페이지
├── styles/                 # 전역 스타일
│   ├── fonts.css
│   ├── reset.css
│   └── variables.css
└── assets/                 # 정적 리소스
    ├── icons/
    └── img/
```

## 🔧 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

### 4. 빌드된 앱 미리보기
```bash
npm run preview
```

## 🔗 API 연동

### 백엔드 서버 설정
- 백엔드 서버: `http://localhost:8080`
- API 엔드포인트: `/api/v1/search`
- 인증 엔드포인트: `/api/auth`

### 주요 API 엔드포인트
```javascript
// 맛집 검색
GET /api/v1/search?type=db&q={query}&category={category}

// 인기 맛집
GET /api/v1/search/trending?location={location}&limit={limit}

// 주변 맛집
GET /api/v1/search/nearby?location={location}&radius={radius}

// 맛집 상세 정보
GET /api/v1/search/detail/{id}

// Google OAuth
GET /oauth2/authorization/google
POST /api/auth/oauth/callback
```

## 🔐 Google OAuth 설정

### 1. Google Cloud Console 설정
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. Google+ API 활성화
4. OAuth 2.0 클라이언트 ID 생성

### 2. 백엔드 환경변수 설정
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
```

### 3. 승인된 리디렉션 URI
- 개발: `http://localhost:3000/auth/callback`
- 운영: `https://yourdomain.com/auth/callback`

## 🎨 UI/UX 특징

### Figma 디자인 반영
- 모바일 우선 반응형 디자인
- 직관적인 카테고리 아이콘과 이모지 사용
- 그라데이션과 모던한 색상 팔레트
- 카드 기반 레이아웃으로 정보 구조화

### 접근성 고려사항
- 키보드 네비게이션 지원
- 포커스 표시기 개선
- 색상 대비 최적화
- 스크린 리더 호환성

## 📊 데이터 처리

### Data 엔티티 기반 구조
```javascript
// DbDataDto 구조
{
  id: Long,              // 데이터 ID
  bizName: String,       // 업소명
  roadAddr: String,      // 도로명주소
  jibunAddr: String,     // 지번주소
  foodType: String,      // 음식 유형
  mainFood: String,      // 주된 음식
  phoneNum: String,      // 전화번호
  naverRating: Double,   // 네이버 평점
  permitNo: String,      // 인허가번호
  applyDate: LocalDate,  // 신청일자
  // ... 기타 필드
}
```

### N/A 처리 정책
- 모든 null/undefined 값은 'N/A'로 표시
- 필수 정보 누락 시 안전한 기본값 제공
- 사용자에게 명확한 정보 제공

## 🚀 배포

### Vite 빌드 최적화
- 코드 스플리팅으로 번들 크기 최적화
- Tree shaking으로 불필요한 코드 제거
- CSS 최소화 및 압축

### 환경 변수
```env
# 개발 환경
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# 운영 환경
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🐛 트러블슈팅

### 일반적인 문제들

1. **API 연결 실패**
   - 백엔드 서버 실행 상태 확인
   - CORS 설정 확인
   - 네트워크 연결 상태 확인

2. **Google OAuth 오류**
   - 클라이언트 ID 확인
   - 리디렉션 URI 설정 확인
   - 브라우저 쿠키 설정 확인

3. **빌드 오류**
   - Node.js 버전 확인 (권장: 18+)
   - 의존성 재설치: `rm -rf node_modules && npm install`

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트에 대한 문의사항이나 버그 리포트는 GitHub Issues를 통해 제출해 주세요.

---

**🍽️ 맛집지도로 당신만의 특별한 맛집 여행을 시작해보세요!**