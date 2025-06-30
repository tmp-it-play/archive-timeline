# 빅테이터 - 맛집 배달 서비스 🍽️

> "오늘을 더 맛있게, 오늘을 더 행복하게"  
> 내 취향으로 나만의 맛집지도를 만들다

Figma 디자인을 기반으로 구현된 모바일 맛집 검색 및 배달 서비스 백엔드입니다.

## 🎨 디자인 컨셉

- **슬로건**: "오늘을 더 맛있게, 오늘을 더 행복하게"
- **컨셉**: 내 취향으로 나만의 맛집지도를 만들 수 있는 개인화된 맛집 추천 서비스
- **타겟**: 모바일 우선 설계로 언제 어디서나 편리한 맛집 검색

## 🚀 주요 기능

### 🏠 홈 화면
- **카테고리별 맛집 탐색**: 14개 주요 카테고리 지원
  - 🍱 도시락, 🧁 디저트, 🍚 한식, 🍜 일식, 🍝 양식
  - 🍣 초밥/회, 🥡 아시안, 🥪 샌드위치, 🥗 샐러드
  - ☕ 카페, 🍕 피자, 🍗 치킨, 🍔 햄버거, 🥐 빵

- **오늘의 우리동네 추천**: 위치 기반 평점 4.5+ 맛집
- **오늘의 블루리본 추천**: 평점 4.8+ 프리미엄 맛집  
- **나의 또간집**: 개인 즐겨찾기 맛집 관리

### 🔍 검색 기능
- **통합 검색**: 업소명, 음식 종류별 실시간 검색
- **자동완성**: 한글 초성 검색 지원
- **인기 검색어**: 실시간 트렌딩 키워드
- **최근 검색어**: 사용자별 검색 히스토리

### 👤 사용자 관리
- **회원가입/로그인**: 개인화 서비스 제공
- **취향 설정**: 선호 카테고리 및 위치 설정
- **즐겨찾기 관리**: 나만의 맛집 리스트 구성

### 📱 모바일 최적화
- **반응형 API**: 모바일 앱 전용 엔드포인트
- **직관적 데이터**: 거리, 평점, 리뷰 수 등 핵심 정보 제공
- **빠른 응답**: 최적화된 데이터 구조

## 🏗️ 기술 스택

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: JPA/Hibernate with MySQL
- **Build Tool**: Gradle

### Architecture
- **Clean Architecture**: Domain-driven 레이어 구조
- **RESTful API**: 표준 REST API 설계
- **DTO Pattern**: 계층간 데이터 전송 최적화

## 📁 프로젝트 구조

```
src/main/java/com/snowykte0426/minsole/
├── domain/
│   ├── auth/                    # 사용자 인증 도메인
│   │   ├── controller/         # 로그인, 회원가입 API
│   │   ├── service/           # 인증 비즈니스 로직
│   │   ├── entity/            # 사용자, 즐겨찾기 엔티티
│   │   └── dto/               # 요청/응답 DTO
│   ├── data/                   # 맛집 데이터 도메인  
│   │   ├── entity/            # 맛집 정보 엔티티
│   │   ├── repository/        # 데이터 접근 계층
│   │   └── service/           # 데이터 처리 서비스
│   ├── mobile/                 # 모바일 전용 API
│   │   ├── controller/        # 홈, 검색, 즐겨찾기 API
│   │   ├── service/           # 모바일 최적화 서비스
│   │   └── dto/               # 모바일 전용 응답 형식
│   ├── restaurant/             # 맛집 도메인
│   │   ├── controller/        # 맛집 관련 API
│   │   ├── service/           # 맛집 비즈니스 로직
│   │   └── dto/               # 맛집 DTO
│   └── search/                 # 검색 도메인
│       ├── controller/        # 검색 API
│       └── service/           # 검색 엔진 서비스
└── global/                     # 글로벌 설정
    ├── config/                # 스프링 설정
    ├── security/              # 보안 설정  
    └── exception/             # 예외 처리
```

## 🌟 핵심 API 엔드포인트

### 🏠 홈 화면 API
```http
# 홈 데이터 조회
GET /api/mobile/home?location=광주 광산구

# 카테고리별 맛집 조회  
GET /api/mobile/home/category/{category}?location=광주 광산구
```

### 🔍 검색 API
```http
# 맛집 검색
POST /api/mobile/search
{
  "query": "짬뽕",
  "location": "광주 광산구"
}

# 자동완성 제안
GET /api/mobile/search/suggestions?query=ㅈ

# 인기 검색어
GET /api/mobile/search/popular
```

### 👤 사용자 API
```http
# 회원가입
POST /api/auth/signup
{
  "username": "user123",
  "password": "password",
  "email": "user@example.com",
  "nickname": "맛집러버",
  "preferredLocation": "광주 광산구",
  "preferredCategories": ["한식", "치킨", "피자"]
}

# 로그인
POST /api/auth/login
{
  "username": "user123", 
  "password": "password"
}
```

### ❤️ 즐겨찾기 API
```http
# 즐겨찾기 추가
POST /api/mobile/favorites?userId=1
{
  "restaurantId": 123
}

# 즐겨찾기 목록 조회
GET /api/mobile/favorites?userId=1
```

## 🗄️ 데이터베이스 구조

### 핵심 테이블
- **data**: 맛집 기본 정보 (업소명, 주소, 평점, 음식종류 등)
- **users**: 사용자 정보 (계정, 선호도 설정)
- **favorite_restaurants**: 사용자별 즐겨찾기

### 데이터 특징
- **실제 맛집 데이터**: 공공 API 기반 실제 업소 정보
- **네이버 평점 연동**: 신뢰성 있는 평점 정보
- **위치 정보**: 주소 기반 지역 분류

## 🎯 Figma 디자인 구현 현황

### ✅ 완료된 화면
- [x] 메인 홈 화면 (카테고리, 추천 섹션)
- [x] 검색 화면 (자동완성, 인기 검색어)
- [x] 로그인/회원가입 화면
- [x] 취향 찾기 화면 (카테고리 선택)
- [x] 위치 등록 화면

### 📱 모바일 UI 특징
- **카드형 레이아웃**: 맛집 정보를 카드 형태로 표시
- **이모지 아이콘**: 각 카테고리별 직관적인 이모지 사용
- **그라데이션 디자인**: 시각적 매력도 높인 배경
- **사용자 친화적 UX**: 간단한 터치 조작으로 모든 기능 이용

## 🚀 시작하기

### 필수 요구사항
- Java 17+
- MySQL 8.0+
- Gradle 8.0+

### 실행 방법
```bash
# 저장소 클론
git clone [repository-url]

# 의존성 설치 및 빌드
./gradlew build

# 애플리케이션 실행
./gradlew bootRun
```

### 환경 설정
```properties
# application.yaml 설정
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/bigdata_db
    username: your_username
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

## 🔧 개발 도구

- **IDE**: IntelliJ IDEA 권장
- **API 테스트**: Postman/Insomnia
- **데이터베이스**: MySQL Workbench
- **버전 관리**: Git

## 📝 API 문서

개발 서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:
- Swagger UI: `http://localhost:8080/swagger-ui.html`

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 👥 개발팀

- **김민솔**: Backend Developer
- **김태은**: Backend Developer

---

**빅테이터**로 오늘도 맛있는 하루 되세요! 🍽️✨
