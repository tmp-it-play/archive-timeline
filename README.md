# 빅테이터 (Bigdata) - 맛집 서비스

빅테이터는 사용자 맞춤형 맛집 추천 및 검색 서비스입니다. 나만의 맛집 지도를 만들고 관리할 수 있습니다.

## 프로젝트 구조

- **프론트엔드**: HTML, CSS, JavaScript
- **백엔드**: Spring Boot, Spring Security, Spring Data JPA
- **데이터베이스**: MySQL
- **인증**: OAuth2 (Google)

## 주요 기능

- 사용자 인증 (Google OAuth2)
- 맛집 검색 및 조회
- 맛집 지도 보기
- 즐겨찾기 기능
- 카테고리별 맛집 필터링
- 위치 기반 근처 맛집 찾기

## 환경 설정

### 필수 환경 변수

`.env` 파일을 프로젝트 루트 디렉토리에 생성하고 다음 값들을 설정하세요:

```
SERVER_PORT=8080
RDB_HOST=localhost
RDB_PORT=3306
RDB_SCHEMA=hot_place_research
RDB_USER=root
RDB_PASSWORD=password
RDB_DDL_AUTO=update
SHOW_SQL=true
LOG_SQL=debug
LOG_BIND=trace
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8080/login/oauth2/code/google
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000
```

### Google OAuth 설정

1. [Google Developer Console](https://console.developers.google.com/)에서 프로젝트 생성
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI 설정: `http://localhost:8080/login/oauth2/code/google`
4. 클라이언트 ID와 시크릿을 `.env` 파일에 설정

## 빌드 및 실행

### 필수 요구사항

- JDK 17 이상
- MySQL 8.0 이상

### 빌드 방법

```bash
./gradlew build
```

### 실행 방법

```bash
./gradlew bootRun
```

또는

```bash
java -jar build/libs/minsole-0.0.1-SNAPSHOT.jar
```

## API 문서

### 레스토랑 API

- `GET /api/restaurants/top-rated` - 인기 맛집 목록
- `GET /api/restaurants/blue-ribbon` - 블루리본 맛집 목록
- `GET /api/restaurants/nearby` - 주변 맛집 목록
- `GET /api/restaurants/search` - 맛집 검색
- `GET /api/restaurants/favorites` - 즐겨찾기 맛집 목록
- `GET /api/restaurants/{id}` - 특정 맛집 상세 정보
- `POST /api/restaurants/{id}/favorite` - 즐겨찾기 토글

### 인증 API

- `GET /oauth2/authorize/google` - Google 로그인 시작
- `GET /api/users/me` - 현재 로그인한 사용자 정보

## 모바일 웹 페이지

- `/mobile` - 스플래시 화면
- `/mobile/login` - 로그인 화면
- `/mobile/main` - 메인 화면
- `/mobile/map` - 맛집 지도 화면
- `/mobile/mypage` - 마이페이지 화면
