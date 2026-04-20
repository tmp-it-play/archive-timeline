# 선생님 회원가입 API

```
POST /user/auth/signup/teacher
Authorization: Bearer {accessToken}
```

로그인(`POST /user/auth/login`) 후 발급된 `UNAUTHENTICATED` 토큰으로 호출한다.

## Request Body

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | String | Y | 이름 |
| sex | String | Y | `MALE` / `FEMALE` |
| deviceToken | String | N | FCM 푸시 토큰 |
| school.sdCode | String | Y | 학교 표준코드 |
| school.name | String | Y | 학교명 |
| school.type | String | Y | `MIDDLE_SCHOOL` / `HIGH_SCHOOL` |
| school.address | String | Y | 학교 주소 |
| school.region | String | Y | 지역명 |
| school.phoneNumber | String | Y | 학교 전화번호 |

```json
{
  "name": "홍길동",
  "sex": "MALE",
  "school": {
    "sdCode": "J100000488",
    "name": "광주소프트웨어마이스터고등학교",
    "type": "HIGH_SCHOOL",
    "address": "광주광역시 광산구 상무대로 312",
    "region": "광주",
    "phoneNumber": "062-949-6800"
  }
}
```

## Response Body (200)

| 필드 | 타입 | 설명 |
|------|------|------|
| accessToken | String | JWT 액세스 토큰 (authority=STAFF) |
| refreshToken | String | JWT 리프레시 토큰 |

```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

## Error

| HTTP | 설명 |
|------|------|
| 401 | Authorization 헤더 없음 또는 만료된 토큰 |
| 403 | 이미 가입된 계정 (UNAUTHENTICATED 아닌 토큰으로 요청) |
