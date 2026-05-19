import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Config } from '../config.js';
import { apiFetch } from '../http.js';
import type { CommonApiResponse, ProjectListResponse } from '../types/api.js';

export function registerProjectTools(server: McpServer, config: Config): void {
  server.registerTool(
    'get_projects',
    {
      title: '프로젝트 목록 조회',
      description:
        'DataGSM에서 프로젝트 목록을 조회합니다. 동아리별, 상태별로 필터링할 수 있습니다. ' +
        'API Key(DATAGSM_API_KEY)가 환경변수에 설정되어 있어야 합니다.',
      inputSchema: z.object({
        projectId: z.number().int().optional().describe('특정 프로젝트 ID'),
        projectName: z.string().optional().describe('프로젝트 이름 (부분 일치)'),
        clubId: z.number().int().optional().describe('연관 동아리 ID로 필터링'),
        status: z
          .enum(['ACTIVE', 'ENDED'])
          .optional()
          .describe('프로젝트 상태 (ACTIVE: 진행 중, ENDED: 종료)'),
        page: z.number().int().min(0).optional().default(0).describe('페이지 번호 (0부터 시작)'),
        size: z
          .number()
          .int()
          .min(1)
          .max(100)
          .optional()
          .default(20)
          .describe('페이지 크기 (최대 100)'),
        sortBy: z.enum(['ID', 'NAME']).optional().describe('정렬 기준'),
        sortDirection: z
          .enum(['ASC', 'DESC'])
          .optional()
          .default('ASC')
          .describe('정렬 방향'),
      }),
      annotations: { readOnlyHint: true },
    },
    async (params) => {
      try {
        const response = (await apiFetch(config, '/v1/projects', {
          params: {
            projectId: params.projectId,
            projectName: params.projectName,
            clubId: params.clubId,
            status: params.status,
            page: params.page,
            size: params.size,
            sortBy: params.sortBy,
            sortDirection: params.sortDirection,
          },
          authMode: 'api-key',
        })) as CommonApiResponse<ProjectListResponse>;

        const data = response.data;
        const summary =
          `총 ${data.totalElements}개 중 ${data.projects.length}개 표시 ` +
          `(전체 ${data.totalPages} 페이지)`;

        return {
          content: [
            {
              type: 'text' as const,
              text: `${summary}\n\n${JSON.stringify(data.projects, null, 2)}`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `프로젝트 조회 실패: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
