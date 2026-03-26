---
id: "net-con-002"
title: "HTTP 상태 코드 그룹과 대표 코드"
difficulty: "junior"
category: "network"
type: "concept"
---

## HTTP 상태 코드란?

HTTP 상태 코드는 서버가 클라이언트의 요청을 어떻게 처리했는지 알려주는 3자리 숫자입니다.
첫 번째 자리 숫자로 큰 그룹을 구분합니다.

## 상태 코드 그룹

| 그룹 | 의미 | 대표 예시 |
|------|------|-----------|
| 1xx | Informational | 100 Continue, 101 Switching Protocols |
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirection | 301 Moved Permanently, 302 Found, 304 Not Modified |
| 4xx | Client Error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict |
| 5xx | Server Error | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout |

## 자주 나오는 코드

### 200 OK
- 요청이 정상적으로 처리됨
- 일반적인 GET 요청 성공 응답

### 201 Created
- 새로운 리소스가 생성됨
- POST로 회원 생성, 글 생성 같은 상황에 자주 사용

### 204 No Content
- 성공했지만 응답 본문이 없음
- 삭제 성공, 토글 성공 같은 경우에 많이 사용

### 301 / 302
- 다른 URL로 이동하라는 의미
- 301은 영구 이동, 302는 임시 이동

### 400 Bad Request
- 요청 형식 자체가 잘못됨
- 필수 파라미터 누락, JSON 파싱 실패 등

### 401 Unauthorized
- 인증이 필요하거나 인증이 실패함
- 보통 토큰이 없거나 유효하지 않을 때

### 403 Forbidden
- 인증은 되었지만 권한이 없음
- 예: 일반 사용자가 관리자 API 호출

### 404 Not Found
- 요청한 리소스를 찾을 수 없음

### 409 Conflict
- 현재 상태와 충돌
- 중복 회원가입, 버전 충돌 등에 사용 가능

### 500 / 503
- 500은 서버 내부 오류
- 503은 서버가 일시적으로 요청을 처리할 수 없는 상태

## 면접 포인트

- 401과 403의 차이를 구분해서 설명할 수 있어야 합니다.
- 200, 201, 204를 상황에 맞게 선택할 수 있어야 합니다.
- 500으로 뭉개기보다 4xx/5xx를 적절히 나눠 쓰는 것이 중요합니다.
