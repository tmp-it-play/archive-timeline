import type { Config } from './config.js';

type AuthMode = 'api-key' | 'bearer' | 'none';

interface FetchOptions {
  params?: Record<string, string | number | boolean | undefined | null>;
  authMode?: AuthMode;
}

export async function apiFetch(
  config: Config,
  path: string,
  options: FetchOptions = {},
): Promise<unknown> {
  const { params, authMode = 'api-key' } = options;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'User-Agent': 'datagsm-mcp/1.0.0',
  };

  if (authMode === 'bearer') {
    if (!config.bearerToken) {
      throw new Error(
        'DATAGSM_BEARER_TOKEN 환경변수가 설정되지 않았습니다. OAuth Bearer 토큰을 환경변수에 등록해주세요.',
      );
    }
    headers['Authorization'] = `Bearer ${config.bearerToken}`;
  } else if (authMode === 'api-key') {
    if (!config.apiKey) {
      throw new Error(
        'DATAGSM_API_KEY 환경변수가 설정되지 않았습니다. DataGSM API Key를 환경변수에 등록해주세요.',
      );
    }
    headers['X-API-Key'] = config.apiKey;
  }

  const url = new URL(path, config.baseUrl);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`DataGSM API 오류 (HTTP ${response.status}): ${body}`);
  }

  return response.json();
}
