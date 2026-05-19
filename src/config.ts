export interface Config {
  apiKey: string | undefined;
  bearerToken: string | undefined;
  baseUrl: string;
  authBaseUrl: string;
  docsBaseUrl: string;
  llmsTxtUrl: string;
}

export function loadConfig(): Config {
  return {
    apiKey: process.env.DATAGSM_API_KEY,
    bearerToken: process.env.DATAGSM_BEARER_TOKEN,
    baseUrl: process.env.DATAGSM_BASE_URL ?? 'https://openapi.datagsm.kr',
    authBaseUrl: process.env.DATAGSM_AUTH_BASE_URL ?? 'https://oauth.datagsm.kr',
    docsBaseUrl: process.env.DATAGSM_DOCS_BASE_URL ?? 'https://docs.datagsm.kr',
    llmsTxtUrl: process.env.DATAGSM_LLMS_TXT_URL ?? 'https://docs.datagsm.kr/llms.txt',
  };
}
