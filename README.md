# Myblog

## 게시글 API

### 1. 전체 게시글 조회
- **URL**: `/api/v1/articles`
- **Method**: `GET`
- **설명**: 모든 게시글 목록을 조회합니다.
- **Response**:
- Status Code: `200 OK`
- Body: 게시글 목록 (`List<ArticleResponse>`)

### 2. 단일 게시글 조회
- **URL**: `/api/v1/articles/{id}`
- **Method**: `GET`
- **설명**: 특정 ID의 게시글을 조회합니다.
- **Path Parameters**:
- `id` (Long): 조회할 게시글의 고유 ID
- **Response**:
- Status Code: `200 OK`
- Body: 게시글 정보 (`ArticleResponse`)

### 3. 게시글 생성
- **URL**: `/api/v1/articles`
- **Method**: `POST`
- **설명**: 새로운 게시글을 생성합니다.
- **Request Body**:
```json
{
  "title": "string",
  "content": "string",
  "tag": "string",
  "image": "string (optional)"
}
  ```
- **Response**:
- Status Code: `201 Created`
- Body: 생성된 게시글 정보 (`ArticleResponse`)

### 4. 게시글 수정
- **URL**: `/api/v1/articles/{id}`
- **Method**: `PATCH`
- **설명**: 특정 게시글을 수정합니다.
- **Path Parameters**:
- `id` (Long): 수정할 게시글의 고유 ID
- **Request Body**:
```json
{
  "title": "string (optional)",
  "content": "string (optional)",
  "tag": "string (optional)",
  "image": "string (optional)"
}
  ```
- **Response**:
- Status Code: `200 OK`
- Body: 수정된 게시글 정보 (`ArticleResponse`)

### 5. 게시글 삭제
- **URL**: `/api/v1/articles/{id}`
- **Method**: `DELETE`
- **설명**: 특정 게시글을 삭제합니다.
- **Path Parameters**:
- `id` (Long): 삭제할 게시글의 고유 ID
- **Response**:
- Status Code: `204 No Content`

### 6. 게시글 조회수 증가
- **URL**: `/api/v1/articles/{id}/view`
- **Method**: `PATCH`
- **설명**: 특정 게시글의 조회수를 증가시킵니다.
- **Path Parameters**:
- `id` (Long): 조회수를 증가시킬 게시글의 고유 ID
- **Response**:
- Status Code: `200 OK`
- Body: 업데이트된 게시글 정보 (`ArticleDto`)

### 7. 태그 조회
- **URL**: `/api/v1/articles/tags`
- **Method**: `GET`
- **설명**: 모든 태그 정보를 조회합니다.
- **Response**:
- Status Code: `200 OK`
- Body: 태그 정보 (`TagResponse`)

## 데이터 모델

### ArticleResponse
```json
{
  "id": "Long",
  "title": "string",
  "content": "string",
  "tag": "string",
  "image": "string (optional)",
  "viewCount": "int",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### PostArticleRequest
```json
{
  "title": "string",
  "content": "string",
  "tag": "string",
  "image": "string (optional)"
}
```

### PatchArticleRequest
```json
{
  "title": "string (optional)",
  "content": "string (optional)",
  "tag": "string (optional)",
  "image": "string (optional)"
}
```

### TagResponse
```json
{
  "tags": ["string"]
}
```


<img src="">

나만의 블로그 만들기 토이 프로젝트입니다.

---

## 커밋 메시지 규칙

| 키워드     | 설명                             |
|------------|----------------------------------|
| `feat`     | 새로운 기능이나 코드 추가 시     |
| `fix`      | 버그 수정 시                     |
| `docs`     | 문서 수정 시                     |
| `style`    | 코드 형식 변경 (기능 변경 없음)  |
| `refactor` | 코드 리팩토링 시                 |
| `test`     | 테스트 코드 작성 시              |
| `chore`    | 기타 작업 시                     |
| `ci`       | CI/CD 파이프라인 변경 시         |
| `pull`     | 브랜치 병합 시                   |
| `merge`    | PR 머지 시                       |
| `delete`   | 파일 삭제 시                     |

### 예시

```agsl
feat: 회원 가입 기능 구현

회원 가입 기능을 구현하였습니다.

Resolves: #123
Ref: #456
Related to: #48, #45
```