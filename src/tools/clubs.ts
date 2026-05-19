import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Config } from '../config.js';
import { apiFetch } from '../http.js';
import type { CommonApiResponse, ClubListResponse } from '../types/api.js';

export function registerClubTools(server: McpServer, config: Config): void {
  server.registerTool(
    'get_clubs',
    {
      title: '동아리 목록 조회',
      description:
        'DataGSM에서 동아리 목록을 조회합니다. 동아리 종류, 운영 상태 등으로 필터링할 수 있습니다. ' +
        'API Key(DATAGSM_API_KEY)가 환경변수에 설정되어 있어야 합니다.',
      inputSchema: z.object({
        clubId: z.number().int().optional().describe('특정 동아리 ID'),
        clubName: z.string().optional().describe('동아리 이름 (부분 일치)'),
        clubType: z
          .enum(['MAJOR_CLUB', 'AUTONOMOUS_CLUB'])
          .optional()
          .describe('동아리 종류 (MAJOR_CLUB: 학과 동아리, AUTONOMOUS_CLUB: 자율 동아리)'),
        clubStatus: z
          .enum(['ACTIVE', 'ABOLISHED'])
          .optional()
          .describe('운영 상태 (ACTIVE: 활성, ABOLISHED: 폐부)'),
        foundedYear: z.number().int().optional().describe('창설 학년도'),
        includeLeaderInParticipants: z
          .boolean()
          .optional()
          .default(false)
          .describe('부장을 부원 목록에 포함할지 여부'),
        page: z.number().int().min(0).optional().default(0).describe('페이지 번호 (0부터 시작)'),
        size: z
          .number()
          .int()
          .min(1)
          .max(100)
          .optional()
          .default(20)
          .describe('페이지 크기 (최대 100)'),
        sortBy: z
          .enum(['ID', 'NAME', 'TYPE', 'FOUNDED_YEAR', 'STATUS'])
          .optional()
          .describe('정렬 기준'),
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
        const response = (await apiFetch(config, '/v1/clubs', {
          params: {
            clubId: params.clubId,
            clubName: params.clubName,
            clubType: params.clubType,
            clubStatus: params.clubStatus,
            foundedYear: params.foundedYear,
            includeLeaderInParticipants: params.includeLeaderInParticipants,
            page: params.page,
            size: params.size,
            sortBy: params.sortBy,
            sortDirection: params.sortDirection,
          },
          authMode: 'api-key',
        })) as CommonApiResponse<ClubListResponse>;

        const data = response.data;
        const summary =
          `총 ${data.pageInfo.totalElements}개 중 ${data.data.length}개 표시 ` +
          `(${data.pageInfo.currentPage + 1}/${data.pageInfo.totalPages} 페이지)`;

        return {
          content: [
            {
              type: 'text' as const,
              text: `${summary}\n\n${JSON.stringify(data.data, null, 2)}`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `동아리 조회 실패: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
