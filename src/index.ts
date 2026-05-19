#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { registerAllTools } from './tools/index.js';

async function main(): Promise<void> {
  process.stdout.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EPIPE') process.exit(0);
  });
  process.on('SIGPIPE', () => process.exit(0));

  const config = loadConfig();

  const server = new McpServer(
    { name: 'datagsm-mcp', version: '1.0.0' },
    {
      instructions:
        'DataGSM(광주소프트웨어마이스터고등학교 OpenAPI + OAuth 서비스)에 접근하는 MCP 서버입니다.\n' +
        '- 문서 검색(search_docs, get_doc, list_docs): 인증 불필요\n' +
        '- Scope 목록(describe_scopes), OAuth 흐름 안내(explain_oauth_flow): 인증 불필요\n' +
        '- 학생/동아리/프로젝트/NEIS 데이터 조회: DATAGSM_API_KEY 환경변수 필요',
    },
  );

  registerAllTools(server, config);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
