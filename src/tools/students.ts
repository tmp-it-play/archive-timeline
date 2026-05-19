import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Config } from '../config.js';
import { apiFetch } from '../http.js';
import type { CommonApiResponse, StudentListResponse } from '../types/api.js';

export function registerStudentTools(server: McpServer, config: Config): void {
  server.registerTool(
    'get_students',
    {
      title: '학생 목록 조회',
      description:
        'DataGSM에서 학생 목록을 조회합니다. 학년, 반, 전공 등 다양한 조건으로 필터링할 수 있습니다. ' +
        'API Key(DATAGSM_API_KEY)가 환경변수에 설정되어 있어야 합니다.',
      inputSchema: z.object({
        studentId: z.number().int().optional().describe('특정 학생 ID'),
        name: z.string().optional().describe('학생 이름 (부분 일치)'),
        email: z.string().optional().describe('학생 이메일'),
        grade: z.number().int().min(1).max(3).optional().describe('학년 (1~3)'),
        classNum: z.number().int().min(1).max(4).optional().describe('반 (1~4)'),
        number: z.number().int().min(1).max(18).optional().describe('번호 (1~18)'),
        sex: z.enum(['MAN', 'WOMAN']).optional().describe('성별'),
        role: z
          .enum([
            'GENERAL_STUDENT',
            'STUDENT_COUNCIL',
            'DORMITORY_MANAGER',
            'CLUB_LEADER',
            'GRADUATE',
            'WITHDRAWN',
          ])
          .optional()
          .describe('학생 역할'),
        major: z
          .enum(['SW_DEVELOPMENT', 'SMART_IOT', 'AI'])
          .optional()
          .describe('전공 (SW개발과, 스마트IOT과, AI과)'),
        dormitoryRoom: z.number().int().optional().describe('기숙사 호실 번호'),
        githubId: z.string().optional().describe('GitHub ID'),
        includeGraduates: z.boolean().optional().default(false).describe('졸업생 포함 여부'),
        includeWithdrawn: z.boolean().optional().default(false).describe('자퇴생 포함 여부'),
        onlyEnrolled: z.boolean().optional().default(false).describe('재학생만 조회'),
        page: z.number().int().min(0).optional().default(0).describe('페이지 번호 (0부터 시작)'),
        size: z
          .number()
          .int()
          .min(1)
          .max(300)
          .optional()
          .default(50)
          .describe('페이지 크기 (최대 300)'),
        sortBy: z
          .enum([
            'ID',
            'NAME',
            'EMAIL',
            'STUDENT_NUMBER',
            'GRADE',
            'CLASS_NUM',
            'NUMBER',
            'MAJOR',
            'ROLE',
            'SEX',
            'DORMITORY_ROOM',
          ])
          .optional()
          .describe('정렬 기준'),
        sortDirection: z
          .enum(['ASC', 'DESC'])
          .optional()
          .default('ASC')
          .describe('정렬 방향 (ASC: 오름차순, DESC: 내림차순)'),
      }),
      annotations: { readOnlyHint: true },
    },
    async (params) => {
      try {
        const response = (await apiFetch(config, '/v1/students', {
          params: {
            studentId: params.studentId,
            name: params.name,
            email: params.email,
            grade: params.grade,
            classNum: params.classNum,
            number: params.number,
            sex: params.sex,
            role: params.role,
            major: params.major,
            dormitoryRoom: params.dormitoryRoom,
            githubId: params.githubId,
            includeGraduates: params.includeGraduates,
            includeWithdrawn: params.includeWithdrawn,
            onlyEnrolled: params.onlyEnrolled,
            page: params.page,
            size: params.size,
            sortBy: params.sortBy,
            sortDirection: params.sortDirection,
          },
          authMode: 'api-key',
        })) as CommonApiResponse<StudentListResponse>;

        const data = response.data;
        const summary =
          `총 ${data.pageInfo.totalElements}명 중 ${data.data.length}명 표시 ` +
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
              text: `학생 조회 실패: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
