# datagsm-mcp

DataGSM(광주소프트웨어마이스터고등학교 OpenAPI + OAuth 서비스) MCP 서버

Claude가 DataGSM의 학생, 동아리, 급식, 학사일정 데이터를 직접 조회하고, 기술 문서를 검색하며, OAuth 흐름을 안내받을 수 있습니다.

## 도구 목록

| 도구                   | 인증      | 설명                                      |
|----------------------|---------|-----------------------------------------|
| `search_docs`        | 불필요     | 키워드로 DataGSM 공식 문서 검색                   |
| `get_doc`            | 불필요     | 특정 URL의 문서 페이지 조회                       |
| `list_docs`          | 불필요     | 전체 문서 목록 조회                             |
| `describe_scopes`    | 불필요     | API Key Scope 목록과 권한 설명                 |
| `explain_oauth_flow` | 불필요     | OAuth PKCE 흐름 설명 및 Authorization URL 생성 |
| `get_students`       | API Key | 학생 목록 조회 (학년/반/전공 등 필터)                 |
| `get_clubs`          | API Key | 동아리 목록 조회                               |
| `get_projects`       | API Key | 프로젝트 목록 조회                              |
| `get_meals`          | API Key | NEIS 급식 정보 조회                           |
| `get_schedules`      | API Key | NEIS 학사일정 조회                            |
| `get_timetables`     | API Key | NEIS 시간표 조회                             |

## 설치 및 설정

### Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json` 에 추가:

```json
{
  "mcpServers": {
    "datagsm": {
      "command": "npx",
      "args": ["-y", "datagsm-mcp"],
      "env": {
        "DATAGSM_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add datagsm -e DATAGSM_API_KEY=your-api-key -- npx -y datagsm-mcp
```

## 환경변수

| 변수                      | 필수          | 기본값                                | 설명                 |
|-------------------------|-------------|------------------------------------|--------------------|
| `DATAGSM_API_KEY`       | 데이터 조회 시    | —                                  | OpenAPI 인증 키       |
| `DATAGSM_BEARER_TOKEN`  | Bearer 사용 시 | —                                  | OAuth Access Token |
| `DATAGSM_BASE_URL`      | 선택          | `https://openapi.datagsm.kr`       | OpenAPI 서버 URL     |
| `DATAGSM_AUTH_BASE_URL` | 선택          | `https://oauth.datagsm.kr`         | OAuth 서버 URL       |
| `DATAGSM_LLMS_TXT_URL`  | 선택          | `https://docs.datagsm.kr/llms.txt` | 문서 목록 URL          |

## 로컬 개발

```bash
git clone https://github.com/your-org/datagsm-mcp
cd datagsm-mcp
npm install
npm run build

# MCP Inspector로 테스트
npx @modelcontextprotocol/inspector node build/index.js
```

## 배포

Git 태그 푸시 시 자동으로 npm에 배포됩니다:

```bash
# package.json version 업데이트 후
git tag v1.0.0
git push origin v1.0.0
```

GitHub 저장소 Settings > Secrets에 `NPM_TOKEN`을 등록해야 합니다.
