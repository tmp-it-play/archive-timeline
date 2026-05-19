import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Config } from '../config.js';

interface DocEntry {
  title: string;
  url: string;
}

function parseLlmsTxt(text: string): DocEntry[] {
  const entries: DocEntry[] = [];

  // 마크다운 테이블 행: | Title | URL |
  const tableRegex = /\|\s*([^|]+?)\s*\|\s*(https?:\/\/[^\s|]+)\s*\|/g;
  let match: RegExpExecArray | null;
  while ((match = tableRegex.exec(text)) !== null) {
    const title = match[1].trim();
    const url = match[2].trim();
    if (title && title !== '문서' && title !== 'URL' && title !== '---') {
      entries.push({ title, url });
    }
  }

  // 불릿 링크: - [Title](URL)
  if (entries.length === 0) {
    const bulletRegex = /^-\s+\[(.+?)\]\((https?:\/\/[^\s)]+)\)/gm;
    while ((match = bulletRegex.exec(text)) !== null) {
      entries.push({ title: match[1].trim(), url: match[2].trim() });
    }
  }

  return entries;
}

function extractText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, '\n')
    .trim()
    .slice(0, 8000);
}

async function fetchPageContent(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      Accept: 'text/html,text/plain,text/markdown',
      'User-Agent': 'datagsm-mcp/1.0.0',
    },
  });
  if (!res.ok) {
    throw new Error(`페이지 로드 실패 (HTTP ${res.status}): ${url}`);
  }
  const text = await res.text();
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('text/html')) {
    return extractText(text);
  }
  return text.slice(0, 8000);
}

export function registerDocTools(server: McpServer, config: Config): void {
  server.registerTool(
    'search_docs',
    {
      title: 'DataGSM 문서 검색',
      description:
        'DataGSM 공식 문서에서 키워드와 관련된 페이지를 찾아 내용을 반환합니다. ' +
        'API 사용법, OAuth 흐름, SDK 안내, Scope 정보 등을 검색할 때 사용하세요.',
      inputSchema: z.object({
        query: z
          .string()
          .describe('검색할 키워드 (예: "OAuth PKCE", "학생 필터링", "급식 API", "SDK 사용법")'),
        maxResults: z
          .number()
          .int()
          .min(1)
          .max(5)
          .optional()
          .default(3)
          .describe('반환할 최대 페이지 수 (기본값: 3)'),
      }),
      annotations: { readOnlyHint: true, idempotentHint: true },
    },
    async ({ query, maxResults }) => {
      try {
        const llmsRes = await fetch(config.llmsTxtUrl, {
          headers: { 'User-Agent': 'datagsm-mcp/1.0.0' },
        });
        if (!llmsRes.ok) {
          throw new Error(`llms.txt 로드 실패 (HTTP ${llmsRes.status})`);
        }
        const llmsText = await llmsRes.text();
        const entries = parseLlmsTxt(llmsText);

        if (entries.length === 0) {
          return {
            content: [{ type: 'text' as const, text: '문서 목록을 파싱하지 못했습니다.' }],
            isError: true,
          };
        }

        const keywords = query.toLowerCase().split(/\s+/);
        const scored = entries
          .map((entry) => {
            const haystack = entry.title.toLowerCase();
            const score = keywords.filter((kw) => haystack.includes(kw)).length;
            return { ...entry, score };
          })
          .filter((e) => e.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, maxResults);

        if (scored.length === 0) {
          const titles = entries.map((e) => `- ${e.title}`).join('\n');
          return {
            content: [
              {
                type: 'text' as const,
                text: `"${query}"와 관련된 문서를 찾지 못했습니다.\n\n**사용 가능한 문서 목록:**\n${titles}`,
              },
            ],
          };
        }

        const results = await Promise.all(
          scored.map(async (entry) => {
            const content = await fetchPageContent(entry.url);
            return `## ${entry.title}\n출처: ${entry.url}\n\n${content}`;
          }),
        );

        return {
          content: [{ type: 'text' as const, text: results.join('\n\n---\n\n') }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `문서 검색 실패: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    'get_doc',
    {
      title: 'DataGSM 특정 문서 조회',
      description:
        'DataGSM 문서 사이트의 특정 URL 페이지 내용을 가져옵니다. ' +
        'search_docs로 찾은 URL을 직접 조회하거나, 알고 있는 문서 경로를 바로 읽을 때 사용하세요.',
      inputSchema: z.object({
        url: z
          .string()
          .url()
          .describe('조회할 문서 URL (예: "https://docs.datagsm.kr/oauth/pkce")'),
      }),
      annotations: { readOnlyHint: true, idempotentHint: true },
    },
    async ({ url }) => {
      try {
        const content = await fetchPageContent(url);
        return {
          content: [{ type: 'text' as const, text: `출처: ${url}\n\n${content}` }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `페이지 조회 실패: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    'list_docs',
    {
      title: 'DataGSM 문서 목록',
      description:
        'DataGSM 공식 문서의 전체 페이지 목록과 URL을 반환합니다. ' +
        '어떤 문서가 있는지 파악하거나 search_docs 전에 목록을 확인할 때 사용하세요.',
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true, idempotentHint: true },
    },
    async () => {
      try {
        const llmsRes = await fetch(config.llmsTxtUrl, {
          headers: { 'User-Agent': 'datagsm-mcp/1.0.0' },
        });
        if (!llmsRes.ok) {
          throw new Error(`llms.txt 로드 실패 (HTTP ${llmsRes.status})`);
        }
        const llmsText = await llmsRes.text();
        const entries = parseLlmsTxt(llmsText);

        const lines = entries.map((e) => `- [${e.title}](${e.url})`).join('\n');
        return {
          content: [
            {
              type: 'text' as const,
              text: `## DataGSM 문서 목록 (총 ${entries.length}개)\n\n${lines}`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `문서 목록 로드 실패: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
