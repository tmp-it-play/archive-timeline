import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Config } from '../config.js';
import { apiFetch } from '../http.js';
import type {
  CommonApiResponse,
  MealListResponse,
  ScheduleListResponse,
  TimetableListResponse,
} from '../types/api.js';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const dateParam = z
  .string()
  .regex(dateRegex)
  .describe('날짜 형식: YYYY-MM-DD');

const dateRangeFields = {
  date: dateParam
    .optional()
    .describe('단일 날짜 (YYYY-MM-DD). date 또는 fromDate+toDate 중 하나만 사용'),
  fromDate: dateParam.optional().describe('조회 시작 날짜 (YYYY-MM-DD)'),
  toDate: dateParam.optional().describe('조회 종료 날짜 (YYYY-MM-DD). 최대 365일 범위'),
};

export function registerNeisTools(server: McpServer, config: Config): void {
  server.registerTool(
    'get_meals',
    {
      title: '급식 정보 조회',
      description:
        'NEIS 연동 급식 정보를 조회합니다. 특정 날짜 또는 기간의 급식 메뉴와 알레르기 정보를 확인할 수 있습니다. ' +
        'API Key(DATAGSM_API_KEY)가 환경변수에 설정되어 있어야 합니다.',
      inputSchema: z.object(dateRangeFields),
      annotations: { readOnlyHint: true },
    },
    async ({ date, fromDate, toDate }) => {
      try {
        const response = (await apiFetch(config, '/v1/neis/meals', {
          params: { date, fromDate, toDate },
          authMode: 'api-key',
        })) as CommonApiResponse<MealListResponse>;

        const meals = response.data.data;
        if (meals.length === 0) {
          return {
            content: [{ type: 'text' as const, text: '조회된 급식 정보가 없습니다.' }],
          };
        }

        return {
          content: [
            {
              type: 'text' as const,
              text: `총 ${meals.length}건의 급식 정보\n\n${JSON.stringify(meals, null, 2)}`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `급식 조회 실패: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    'get_schedules',
    {
      title: '학사일정 조회',
      description:
        'NEIS 연동 학사일정을 조회합니다. 특정 날짜 또는 기간의 행사 및 학사 일정을 확인할 수 있습니다. ' +
        'API Key(DATAGSM_API_KEY)가 환경변수에 설정되어 있어야 합니다.',
      inputSchema: z.object(dateRangeFields),
      annotations: { readOnlyHint: true },
    },
    async ({ date, fromDate, toDate }) => {
      try {
        const response = (await apiFetch(config, '/v1/neis/schedules', {
          params: { date, fromDate, toDate },
          authMode: 'api-key',
        })) as CommonApiResponse<ScheduleListResponse>;

        const schedules = response.data.data;
        if (schedules.length === 0) {
          return {
            content: [{ type: 'text' as const, text: '조회된 학사일정이 없습니다.' }],
          };
        }

        return {
          content: [
            {
              type: 'text' as const,
              text: `총 ${schedules.length}건의 학사일정\n\n${JSON.stringify(schedules, null, 2)}`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `학사일정 조회 실패: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    'get_timetables',
    {
      title: '시간표 조회',
      description:
        'NEIS 연동 시간표를 조회합니다. 학년과 반을 지정하고 날짜 또는 기간을 입력해야 합니다. ' +
        'API Key(DATAGSM_API_KEY)가 환경변수에 설정되어 있어야 합니다.',
      inputSchema: z.object({
        grade: z.number().int().min(1).max(3).describe('학년 (1~3, 필수)'),
        classNum: z.number().int().min(1).max(4).describe('반 (1~4, 필수)'),
        ...dateRangeFields,
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ grade, classNum, date, fromDate, toDate }) => {
      try {
        const response = (await apiFetch(config, '/v1/neis/timetables', {
          params: { grade, classNum, date, fromDate, toDate },
          authMode: 'api-key',
        })) as CommonApiResponse<TimetableListResponse>;

        const timetables = response.data.data;
        if (timetables.length === 0) {
          return {
            content: [{ type: 'text' as const, text: '조회된 시간표가 없습니다.' }],
          };
        }

        return {
          content: [
            {
              type: 'text' as const,
              text: `${grade}학년 ${classNum}반 시간표 (${timetables.length}일)\n\n${JSON.stringify(timetables, null, 2)}`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `시간표 조회 실패: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
