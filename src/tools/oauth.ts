import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Config } from '../config.js';

const SCOPES = [
  { scope: 'student:read', description: '학생 데이터 조회', requiredRole: 'USER' },
  { scope: 'student:write', description: '학생 데이터 생성/수정/삭제', requiredRole: 'ADMIN' },
  { scope: 'student:*', description: '학생 데이터 모든 권한 (조회 + 생성/수정/삭제)', requiredRole: 'ADMIN' },
  { scope: 'club:read', description: '동아리 데이터 조회', requiredRole: 'USER' },
  { scope: 'club:write', description: '동아리 데이터 생성/수정/삭제', requiredRole: 'ADMIN' },
  { scope: 'club:*', description: '동아리 데이터 모든 권한', requiredRole: 'ADMIN' },
  { scope: 'project:read', description: '프로젝트 데이터 조회', requiredRole: 'USER' },
  { scope: 'project:write', description: '프로젝트 데이터 생성/수정/삭제', requiredRole: 'ADMIN' },
  { scope: 'project:*', description: '프로젝트 데이터 모든 권한', requiredRole: 'ADMIN' },
  { scope: 'neis:read', description: 'NEIS 급식/학사일정/시간표 조회', requiredRole: 'USER' },
  { scope: 'neis:*', description: 'NEIS 데이터 모든 권한', requiredRole: 'ADMIN' },
  { scope: 'webhook:write', description: 'Webhook 등록/수정/삭제', requiredRole: 'USER' },
] as const;

export function registerOauthTools(server: McpServer, config: Config): void {
  server.registerTool(
    'describe_scopes',
    {
      title: 'DataGSM API Key Scope 목록',
      description:
        'DataGSM API Key의 모든 권한 Scope와 설명을 반환합니다. ' +
        'API Key 발급 시 어떤 Scope를 요청해야 하는지 안내할 때 사용하세요.',
      inputSchema: z.object({
        filter: z
          .enum(['all', 'user', 'admin'])
          .optional()
          .default('all')
          .describe('표시할 Scope 범위: all(전체), user(USER 역할), admin(ADMIN 역할)'),
      }),
      annotations: { readOnlyHint: true, idempotentHint: true },
    },
    async ({ filter }) => {
      const filtered =
        filter === 'user'
          ? SCOPES.filter((s) => s.requiredRole === 'USER')
          : filter === 'admin'
            ? SCOPES.filter((s) => s.requiredRole === 'ADMIN')
            : SCOPES;

      const lines = filtered.map(
        (s) => `- \`${s.scope}\` — ${s.description} (필요 역할: ${s.requiredRole})`,
      );

      const text = `## DataGSM API Key Scope 목록\n\n${lines.join('\n')}\n\n` +
        `**참고**: 읽기(read) Scope는 USER 역할 계정, 쓰기(write) Scope는 ADMIN 역할 계정에서만 발급 가능합니다.`;

      return { content: [{ type: 'text' as const, text }] };
    },
  );

  server.registerTool(
    'explain_oauth_flow',
    {
      title: 'DataGSM OAuth 흐름 안내',
      description:
        'DataGSM OAuth 2.0 Authorization Code + PKCE 흐름을 단계별로 설명합니다. ' +
        'clientId를 제공하면 실제 Authorization URL을 생성합니다.',
      inputSchema: z.object({
        clientId: z
          .string()
          .optional()
          .describe('등록된 OAuth 클라이언트 ID (제공 시 authorize URL 생성)'),
        redirectUri: z.string().url().optional().describe('리다이렉트 URI'),
        scopes: z
          .array(z.string())
          .optional()
          .describe('요청할 scope 목록 (예: ["self:read"])'),
        state: z.string().optional().describe('CSRF 방지용 state 값'),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ clientId, redirectUri, scopes, state }) => {
      const authorizeBase = `${config.authBaseUrl}/v1/oauth/authorize`;
      const tokenEndpoint = `${config.authBaseUrl}/v1/oauth/token`;
      const userinfoEndpoint = `${config.authBaseUrl}/userinfo`;

      let authorizeUrlSection = '';
      if (clientId && redirectUri) {
        const params = new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: 'code',
          code_challenge_method: 'S256',
          code_challenge: '<PKCE_CODE_CHALLENGE>',
        });
        if (scopes?.length) params.set('scope', scopes.join(' '));
        if (state) params.set('state', state);
        authorizeUrlSection = `\n### 생성된 Authorization URL\n\`\`\`\n${authorizeBase}?${params.toString()}\n\`\`\`\n> \`<PKCE_CODE_CHALLENGE>\` 를 실제로 생성한 code_challenge 값으로 교체하세요.\n`;
      }

      const text = `## DataGSM OAuth 2.0 Authorization Code + PKCE 흐름
${authorizeUrlSection}
### 1단계: PKCE 값 생성

\`\`\`
code_verifier  = 랜덤 43~128자 URL-safe 문자열
code_challenge = BASE64URL(SHA256(ASCII(code_verifier)))
\`\`\`

### 2단계: 인증 요청 (GET)

\`\`\`
GET ${authorizeBase}
  ?client_id={client_id}
  &redirect_uri={redirect_uri}
  &response_type=code
  &code_challenge={code_challenge}
  &code_challenge_method=S256
  &scope={scope1 scope2}
  &state={state}
\`\`\`

사용자가 로그인하면 \`redirect_uri?code={authorization_code}&state={state}\` 로 리다이렉트됩니다.

### 3단계: 토큰 교환 (POST)

\`\`\`
POST ${tokenEndpoint}
Content-Type: application/json

{
  "grant_type": "authorization_code",
  "client_id": "{client_id}",
  "client_secret": "{client_secret}",
  "code": "{authorization_code}",
  "redirect_uri": "{redirect_uri}",
  "code_verifier": "{code_verifier}"
}
\`\`\`

응답:
\`\`\`json
{
  "access_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "eyJ...",
  "scope": "self:read"
}
\`\`\`

### 4단계: 사용자 정보 조회 (GET)

\`\`\`
GET ${userinfoEndpoint}
Authorization: Bearer {access_token}
\`\`\`

### 5단계: 토큰 갱신 (POST)

\`\`\`
POST ${tokenEndpoint}
Content-Type: application/json

{
  "grant_type": "refresh_token",
  "client_id": "{client_id}",
  "client_secret": "{client_secret}",
  "refresh_token": "{refresh_token}"
}
\`\`\`

### 주요 토큰 유효기간

| 항목 | 만료 시간 |
|------|----------|
| Access Token | 1시간 |
| Refresh Token | 30일 |
| Authorization Code | 5분 |
`;

      return { content: [{ type: 'text' as const, text }] };
    },
  );
}
