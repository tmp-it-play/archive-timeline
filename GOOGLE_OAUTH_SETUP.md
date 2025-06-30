# Google OAuth 설정 가이드

BigData-Server 프로젝트에서 Google OAuth 로그인을 설정하는 방법을 안내합니다.

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택

### 1.2 OAuth 2.0 클라이언트 ID 생성
1. **API 및 서비스** > **사용자 인증 정보**로 이동
2. **+ 사용자 인증 정보 만들기** > **OAuth 클라이언트 ID** 선택
3. **애플리케이션 유형**: 웹 애플리케이션 선택
4. **이름**: "BigData-Server" (원하는 이름)
5. **승인된 자바스크립트 원본**:
   ```
   http://localhost:8080
   ```
6. **승인된 리디렉션 URI**:
   ```
   http://localhost:8080/login/oauth2/code/google
   ```
7. **만들기** 클릭

### 1.3 OAuth 동의 화면 설정
1. **OAuth 동의 화면** 메뉴로 이동
2. **User Type**: External 선택 (테스트용)
3. **앱 이름**: "빅테이터"
4. **사용자 지원 이메일**: 개발자 이메일
5. **앱 도메인**: localhost (개발용)
6. **범위**: email, profile 추가
7. **테스트 사용자**: 테스트할 Google 계정 추가

## 2. 애플리케이션 설정

### 2.1 환경 변수 설정
`.env` 파일에 Google OAuth 정보를 추가하세요:

```bash
# Google OAuth 설정
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8080/login/oauth2/code/google

# JWT 설정
JWT_SECRET=your_jwt_secret_key_here_at_least_32_characters_long_for_security
JWT_EXPIRATION=86400000
```

### 2.2 데이터베이스 설정
MySQL 데이터베이스에 사용자 테이블이 자동으로 생성됩니다:

```sql
-- users 테이블이 자동 생성됨
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    profile_image_url VARCHAR(500),
    provider VARCHAR(50) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

## 3. 애플리케이션 실행

### 3.1 의존성 설치 및 빌드
```bash
./gradlew build
```

### 3.2 애플리케이션 시작
```bash
./gradlew bootRun
```

또는

```bash
java -jar build/libs/minsole-0.0.1-SNAPSHOT.jar
```

## 4. 테스트

### 4.1 로그인 플로우 테스트
1. 브라우저에서 `http://localhost:8080` 접속
2. "시작하기" 버튼 클릭
3. "Google로 로그인" 버튼 클릭
4. Google 계정으로 로그인
5. 메인 페이지로 리다이렉트 확인

### 4.2 API 테스트
```bash
# 사용자 정보 조회 (JWT 토큰 필요)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8080/api/auth/user

# 로그아웃
curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8080/api/auth/logout
```

## 5. 주요 엔드포인트

| 엔드포인트 | 설명 |
|-----------|------|
| `/` | 메인 스플래시 페이지 |
| `/login` | 로그인 페이지 |
| `/main` | 애플리케이션 메인 페이지 |
| `/oauth2/authorization/google` | Google OAuth 시작 |
| `/api/auth/user` | 현재 사용자 정보 조회 |
| `/api/auth/logout` | 로그아웃 |

## 6. 보안 고려사항

- **프로덕션 환경**에서는 HTTPS 사용 필수
- JWT Secret은 충분히 복잡하고 긴 문자열 사용
- 환경 변수는 `.env` 파일이 아닌 시스템 환경 변수나 보안 저장소 사용 권장
- Google OAuth 클라이언트 정보는 절대 소스코드에 포함하지 않기

## 7. 트러블슈팅

### 자주 발생하는 문제

1. **리다이렉션 URI 불일치**
   - Google Console의 승인된 리디렉션 URI와 설정이 정확히 일치하는지 확인

2. **JWT 토큰 관련 오류**
   - JWT_SECRET이 충분히 긴지 확인 (최소 32자)
   - 토큰 만료 시간 확인

3. **데이터베이스 연결 오류**
   - MySQL 서버 실행 상태 확인
   - 데이터베이스 접속 정보 확인

4. **OAuth 동의 화면 오류**
   - 테스트 사용자로 등록된 계정인지 확인
   - 앱 승인 상태 확인

### 로그 확인
```bash
# 애플리케이션 로그에서 OAuth 관련 로그 확인
tail -f logs/spring.log | grep -i oauth
```

## 8. 추가 설정 (선택사항)

### 8.1 카카오 OAuth 추가
향후 카카오 로그인도 추가할 수 있도록 구조가 설계되어 있습니다.

### 8.2 프로필 이미지 저장
현재는 Google 프로필 이미지 URL만 저장하며, 필요시 이미지를 로컬에 저장하는 기능을 추가할 수 있습니다.

---

문의사항이나 문제가 발생하면 이슈를 등록해주세요.
