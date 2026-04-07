// ============================================================
// HOOKS
// ============================================================

export const PRE_TOOL_USE_SH = `#!/bin/bash
# .claude/hooks/preToolUse.sh
# Claude가 도구를 실행하기 전 호출됩니다

TOOL_NAME="\${CLAUDE_TOOL_NAME}"
TOOL_INPUT="\${CLAUDE_TOOL_INPUT}"

# 모든 명령어를 로그에 기록
echo "[\$(date '+%Y-%m-%d %H:%M:%S')] \$TOOL_NAME: \$TOOL_INPUT" >> .claude/command.log

# 위험한 명령어 패턴 차단
if [[ "\$TOOL_NAME" == "Bash" ]]; then
  if echo "\$TOOL_INPUT" | grep -qE 'rm -rf /|sudo rm|dd if=|mkfs|curl.*\\| *sh'; then
    echo "차단됨: 위험한 명령어 패턴이 감지되었습니다" >&2
    exit 2  # exit 2 = Claude에게 에러 메시지 표시 후 계속 진행
  fi
fi`.trim()

export const POST_TOOL_USE_SH = `#!/bin/bash
# .claude/hooks/postToolUse.sh
# Edit/Write 도구 실행 후 자동으로 포맷팅과 테스트를 실행합니다

TOOL_NAME="\${CLAUDE_TOOL_NAME}"
FILE_PATH="\${CLAUDE_TOOL_INPUT_FILE_PATH}"

# .kt 파일 수정 시 ktlint 자동 실행
if [[ "\$FILE_PATH" == *.kt ]]; then
  echo "ktlint 포맷팅 실행 중: \$FILE_PATH"
  ./gradlew ktlintFormat -PinputFiles="\$FILE_PATH" --quiet

  # *ServiceImpl.kt 수정 시 관련 테스트 자동 실행
  if [[ "\$FILE_PATH" == *ServiceImpl.kt ]]; then
    SERVICE_NAME=\$(basename "\$FILE_PATH" ServiceImpl.kt)
    echo "테스트 실행 중: \${SERVICE_NAME}*"
    TEST_OUTPUT=\$(./gradlew test --tests "*\${SERVICE_NAME}*" 2>&1)
    if echo "\$TEST_OUTPUT" | grep -q "BUILD SUCCESSFUL"; then
      echo "✓ 테스트 통과"
    else
      echo "✗ 테스트 실패 — 결과를 확인하세요"
      echo "\$TEST_OUTPUT" | tail -20
    fi
  fi
fi`.trim()

export const hookLifecycle = [
  {
    name: 'PreToolUse',
    trigger: 'Claude가 도구(Bash, Edit, Write 등)를 실행하기 직전',
    useCases: [
      '위험한 명령어 패턴 차단 (rm -rf, sudo rm 등)',
      '실행 전 사전 검증 및 승인 요청',
      '모든 명령어 감사 로그 기록',
      '특정 파일/경로 접근 제한',
    ],
    exitCodes: [
      { code: '0', meaning: '정상 진행' },
      { code: '2', meaning: 'Claude에게 stderr 내용을 에러로 표시 (실행은 계속)' },
      { code: '기타', meaning: '도구 실행 차단 + stdout/stderr를 Claude에게 전달' },
    ],
    env: ['CLAUDE_TOOL_NAME', 'CLAUDE_TOOL_INPUT'],
  },
  {
    name: 'PostToolUse',
    trigger: '도구 실행이 완료된 직후',
    useCases: [
      '파일 수정 후 자동 포맷터 실행 (prettier, ktlint 등)',
      '코드 변경 후 관련 테스트 자동 실행',
      '변경 내용 감사 로그 기록',
      '부수 작업 자동화 (문서 갱신, 린트 등)',
    ],
    exitCodes: [
      { code: '0', meaning: '정상 완료' },
      { code: '2', meaning: 'Claude에게 경고 메시지 전달' },
    ],
    env: ['CLAUDE_TOOL_NAME', 'CLAUDE_TOOL_INPUT_FILE_PATH', 'CLAUDE_TOOL_OUTPUT'],
  },
  {
    name: 'Stop',
    trigger: 'Claude가 응답을 완료하고 종료하려 할 때',
    useCases: [
      '응답 품질 검증 (필수 파일 수정 여부 확인)',
      '완료 조건 미충족 시 재시도 요청',
      '완료 후 요약 리포트 생성',
      '특정 조건이 충족될 때까지 루프 실행',
    ],
    exitCodes: [
      { code: '0', meaning: '정상 종료' },
      { code: '2', meaning: 'Claude가 계속 실행 (Stop 방지)' },
    ],
    env: ['CLAUDE_STOP_REASON', 'CLAUDE_RESPONSE'],
  },
  {
    name: 'SubagentStop',
    trigger: '서브에이전트가 작업을 완료하고 종료할 때',
    useCases: [
      '서브에이전트 결과 검증',
      '서브에이전트 완료 후 후처리 작업',
      '에이전트 간 결과 전달 포맷 표준화',
    ],
    exitCodes: [
      { code: '0', meaning: '정상 종료' },
      { code: '2', meaning: '서브에이전트 계속 실행' },
    ],
    env: ['CLAUDE_SUBAGENT_OUTPUT'],
  },
  {
    name: 'Notification',
    trigger: 'Claude가 사용자에게 알림을 보내려 할 때',
    useCases: [
      '알림 내용을 Slack/Discord로 전달',
      '특정 키워드 포함 시 이메일 발송',
      '로그 파일에 알림 기록',
    ],
    exitCodes: [
      { code: '0', meaning: '정상 처리' },
    ],
    env: ['CLAUDE_NOTIFICATION_MESSAGE'],
  },
]

// ============================================================
// SKILLS
// ============================================================

export const SKILL_FOLDER_STRUCTURE = `.claude/
└── skills/
    ├── commit/
    │   ├── SKILL.md          ← 트리거 정의 + 프롬프트
    │   └── references/
    │       └── scope-guide.md
    ├── code-review/
    │   └── SKILL.md
    └── review-pr/
        ├── SKILL.md
        ├── references/
        │   └── reply-formats.md
        └── scripts/
            └── get-pr-data.sh`.trim()

export const skillExamples = [
  {
    name: 'commit',
    trigger: '/commit',
    file: '.claude/skills/commit/SKILL.md',
    code: `# Commit Skill

When the user runs /commit:

## 작업 순서

1. \`git diff --staged\` 로 스테이징된 변경사항 분석
2. 변경의 성격 파악: add / update / fix / refactor / docs / test
3. 영향 범위 기준으로 논리적 커밋 단위 그룹화
4. 아직 브랜치가 없으면 \`<type>/<description>\` 형식으로 생성
   - 예: \`fix/auth-token-expiry\`, \`add/student-search-api\`

## 커밋 메시지 규칙 (.claude/rules/commit-conventions.md 참고)

\`\`\`
<type>(<scope>): <description>
\`\`\`

- type: add | update | fix | refactor | ci/cd | docs | test | merge
- scope: 도메인명 우선 (auth, student, club) — 모듈명 지양
- description: 한국어, 마침표 없음
- 예: \`fix(auth): 토큰 만료 시 재발급 로직 누락 수정\`

## 주의

- 자동 push 금지 — 커밋만 수행
- 여러 도메인 변경 시 반드시 커밋 분리`,
  },
  {
    name: 'code-review',
    trigger: '/code-review',
    file: '.claude/skills/code-review/SKILL.md',
    code: `# Code Review Skill

When the user runs /code-review:

## 리뷰 절차

1. \`git diff develop...HEAD\` 로 변경사항 수집
2. \`.claude/rules/*.md\` 파일을 모두 로드하여 컨벤션 기준 수립
3. 각 규칙 파일 기준으로 위반사항 탐지

## 체크리스트

- [ ] DTO 어노테이션 타겟 (\`@field:\` vs \`@param:\`)
- [ ] \`@Transactional(readOnly = true)\` 누락 여부
- [ ] 로깅 형식 (영어, 동사 시작, \`{}\` 플레이스홀더)
- [ ] Kotlin 관용구 (\`val\` 우선, 생성자 주입)
- [ ] 예외 처리 표준 준수
- [ ] 테스트 커버리지 (서비스 변경 시 Kotest 필수)
- [ ] 커밋 메시지 형식
- [ ] 보안 취약점 (SQL 인젝션, 인증/인가 누락)

## 출력 형식

✓ / ⚠ / ✗ 로 각 항목 상태 표시
위반사항은 파일:라인 형식으로 위치 명시`,
  },
  {
    name: 'review-pr',
    trigger: '/review-pr',
    file: '.claude/skills/review-pr/SKILL.md',
    code: `# Review PR Skill

When the user runs /review-pr [PR번호]:

## 작업 순서

1. \`gh pr view <PR번호>\` 로 PR 메타데이터 수집
2. \`gh pr diff <PR번호>\` 로 전체 변경사항 확인
3. \`gh api repos/{owner}/{repo}/pulls/<PR번호>/comments\` 로 리뷰 댓글 수집
4. 각 댓글을 프로젝트 컨벤션 기준으로 판단:
   - ✅ 유효: 자동 수정 적용 + 한국어 답변 작성
   - ❌ 무효: 컨벤션 근거 명시 후 정중히 거절
   - ⚠ 부분: 일부만 수용, 이유 설명

## 답변 형식

각 댓글에 \`.claude/rules/\` 의 규칙 파일을 인용하여 근거 제시

## 주의

- 최종 답변 작성 전 사용자 확인 필수
- 자동 approve/merge 금지`,
  },
]

export const skillBenefits = [
  {
    title: '재사용 가능한 워크플로우',
    desc: '복잡한 다단계 작업을 /commit 같은 단일 트리거로 캡슐화',
  },
  {
    title: '컨텍스트 일관성',
    desc: '팀 컨벤션과 규칙을 참조 파일로 관리 — 매번 설명할 필요 없음',
  },
  {
    title: '점진적 개선',
    desc: 'SKILL.md만 수정하면 모든 팀원이 즉시 개선된 프로세스를 사용',
  },
  {
    title: '도메인 지식 보존',
    desc: '암묵적 팀 지식을 명시적 파일로 코드베이스에 영구 보존',
  },
]

// ============================================================
// CLAUDE.md
// ============================================================

export const CLAUDE_MD_TEMPLATE = `# 프로젝트명

## 개요
이 프로젝트는 [목적/설명]. 주요 기술 스택: [기술들].

## 개발 명령어
\`\`\`bash
./gradlew build          # 빌드
./gradlew test           # 전체 테스트
./gradlew ktlintFormat   # 코드 포맷팅
\`\`\`

## 아키텍처
레이어드 아키텍처 (Controller → Service → Repository).
- 비즈니스 로직은 Service 레이어에만 위치
- Repository는 데이터 접근만 담당
- DTO는 레이어 경계에서만 사용

## 핵심 원칙
- 의존성 역전: 인터페이스 기반 설계
- 단일 책임: 클래스당 하나의 변경 이유
- 테스트: 서비스 변경 시 Kotest 테스트 필수

## 코딩 컨벤션
자세한 내용은 \`.claude/rules/\` 디렉토리 참조.
- kotlin-style.md: Kotlin 코딩 스타일
- api-conventions.md: REST API 패턴
- commit-conventions.md: 커밋 메시지 규칙

## 주의사항
- \`/src/main/resources/application-prod.yml\` 절대 수정 금지
- 마이그레이션 파일은 생성 후 수정 불가`.trim()

export const claudeMdSections = [
  { title: '프로젝트 개요', why: 'Claude가 프로젝트 목적과 맥락을 파악하기 위한 기반' },
  { title: '빌드/실행 명령어', why: '올바른 명령어를 추측 없이 즉시 실행 가능' },
  { title: '아키텍처 설명', why: '코드 변경 시 레이어 경계를 올바르게 판단' },
  { title: '핵심 원칙', why: '팀이 중요하게 여기는 설계 원칙을 Claude가 내면화' },
  { title: '컨벤션 파일 참조', why: '세부 규칙은 별도 파일로 분리 — CLAUDE.md 길이 유지' },
  { title: '금지/주의 사항', why: '되돌리기 어려운 실수를 사전에 방지' },
]

// ============================================================
// SUB-AGENTS
// ============================================================

export const softwareEras = [
  {
    era: 'Software 1.0',
    subtitle: '명시적 코드의 시대',
    description: '개발자가 모든 if-else, 루프, 함수를 직접 작성. "어떻게"를 코드로 명시.',
    traits: [
      '개발자가 로직의 모든 분기를 설계',
      '함수 = 인풋 → 아웃풋을 명확히 정의',
      '버그 = 잘못된 로직, 디버깅으로 추적 가능',
    ],
    accent: false,
  },
  {
    era: 'Software 3.0',
    subtitle: 'LLM이 실행 엔진인 시대',
    description: '프롬프트가 프로그램. 자연어로 "무엇을"만 설명하면 LLM이 "어떻게"를 결정.',
    traits: [
      'CLAUDE.md, 에이전트 설명 = 새로운 소스코드',
      'Sub-Agent = 단일 책임을 가진 마이크로서비스',
      'Hooks = 이벤트 기반 미들웨어',
    ],
    accent: true,
  },
]

export const TEST_FIXER_AGENT = `---
name: test-fixer
description: >
  Kotlin 테스트 실패를 감지하고 자동으로 수정합니다.
  "테스트 고쳐줘" 또는 "test fix" 로 호출하세요.
---

## 작업 순서

1. \`./gradlew test\` 실행 후 실패한 테스트 목록 수집
2. 각 실패에 대해 스택 트레이스 분석:
   - 서비스 로직 버그 → 서비스 파일 수정
   - 테스트 assertion 불일치 → 테스트 파일 수정
3. 수정 후 해당 테스트 재실행 (최대 3회 시도)
4. 모든 테스트 통과 시 수정 내역 요약 보고

## 제약

- 기능 추가 금지 — 테스트 통과만 목표
- 3회 시도 후에도 실패 시 원인 분석 리포트 작성`.trim()

export const CONVENTION_VALIDATOR_AGENT = `---
name: convention-validator
description: >
  코드 컨벤션 위반을 감지하고 자동으로 수정합니다.
  "컨벤션 체크" 또는 "convention check" 로 호출하세요.
---

## 감지 항목

\`.claude/rules/\` 파일을 기반으로 다음을 검사합니다:

1. **DTO 어노테이션** (\`dto-annotations.md\`)
   - \`@JsonProperty\` → \`@field:JsonProperty\` 로 교체
2. **로깅 형식** (\`logging.md\`)
   - 영어, 동사 시작, \`{}\` 플레이스홀더 사용 확인
3. **@Transactional** (\`api-conventions.md\`)
   - 조회 메서드에 \`readOnly = true\` 누락 감지
4. **Kotlin 관용구** (\`kotlin-style.md\`)
   - \`var\` → \`val\` 치환 가능 여부 확인

## 출력

각 위반사항: 파일명:라인 + 수정 내용 + 적용된 규칙 파일 명시`.trim()

export const agentBenefits = [
  {
    title: 'SRP (단일 책임 원칙)',
    desc: '각 에이전트가 하나의 책임만 가짐. test-fixer는 테스트만, validator는 컨벤션만.',
  },
  {
    title: '독립적 실행',
    desc: '에이전트는 별도 컨텍스트에서 실행 — 메인 대화를 오염시키지 않음.',
  },
  {
    title: '재사용 & 조합',
    desc: '여러 에이전트를 순서대로 호출하여 복잡한 워크플로우 구성 가능.',
  },
  {
    title: '전문화된 지식',
    desc: '에이전트마다 필요한 컨텍스트만 주입 — 프롬프트 공간 효율적 활용.',
  },
]

// ============================================================
// SETTINGS
// ============================================================

export const SETTINGS_JSON = `{
  "permissions": {
    "allow": [
      "WebSearch",
      "WebFetch",
      "Bash(./gradlew *)",
      "Bash(git diff*)",
      "Bash(git status)",
      "Bash(git log*)",
      "Bash(git add*)",
      "Bash(git commit*)",
      "Bash(git branch*)",
      "Bash(git checkout*)"
    ],
    "deny": [
      "Bash(git push*)",
      "Bash(rm -rf*)"
    ]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/preToolUse.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/postToolUse.sh"
          }
        ]
      }
    ]
  },
  "language": "korean",
  "effortLevel": "medium",
  "includeGitInstructions": false
}`.trim()

export const settingsOptions = [
  {
    key: 'permissions.allow',
    type: 'string[]',
    desc: '자동 승인할 도구 패턴 목록. 글로브 패턴 지원 (예: Bash(git *)). 이 목록의 도구는 사용자 승인 없이 즉시 실행됩니다.',
  },
  {
    key: 'permissions.deny',
    type: 'string[]',
    desc: '항상 거부할 도구 패턴. allow보다 우선 적용됩니다. 위험한 명령어를 명시적으로 차단하는 데 사용합니다.',
  },
  {
    key: 'hooks',
    type: 'object',
    desc: 'PreToolUse / PostToolUse / Stop / SubagentStop / Notification 이벤트에 셸 스크립트를 연결합니다.',
  },
  {
    key: 'language',
    type: '"korean" | "english" | ...',
    desc: 'Claude 응답 언어 설정. "korean" 으로 설정 시 한국어로 기본 응답합니다.',
  },
  {
    key: 'effortLevel',
    type: '"low" | "medium" | "high"',
    desc: 'Claude의 작업 노력 수준. high는 더 신중하고 철저하지만 느립니다. 일반 개발은 medium 권장.',
  },
  {
    key: 'includeGitInstructions',
    type: 'boolean',
    desc: 'Claude의 기본 git 지침 포함 여부. CLAUDE.md에 자체 git 규칙이 있다면 false로 설정하세요.',
  },
]

export const effortLevels = [
  {
    level: 'low',
    label: 'Low',
    desc: '빠른 응답, 간단한 작업에 적합',
    items: ['단순 질문/답변', '빠른 코드 조회', '간단한 수정'],
  },
  {
    level: 'medium',
    label: 'Medium',
    desc: '균형잡힌 기본값, 일반 개발에 권장',
    items: ['일반적인 기능 개발', '코드 리뷰', '리팩토링'],
    recommended: true,
  },
  {
    level: 'high',
    label: 'High',
    desc: '철저한 분석, 복잡한 작업에 적합',
    items: ['아키텍처 설계', '복잡한 버그 디버깅', '보안 검토'],
  },
]

// ============================================================
// CONTEXT WINDOW
// ============================================================

export const contextBudgetItems = [
  { label: 'System Prompt', tokens: 8000, pct: 4, color: '#7dd3fc', desc: 'Claude Code 내장 지침' },
  { label: 'CLAUDE.md', tokens: 6000, pct: 3, color: '#d97757', desc: '프로젝트 컨텍스트 (50-70줄 권장)' },
  { label: 'Conversation History', tokens: 40000, pct: 20, color: '#a78bfa', desc: '이전 대화 전체 누적' },
  { label: 'Tool Results', tokens: 60000, pct: 30, color: '#fde68a', desc: '파일 읽기, 검색 결과 등' },
  { label: 'Available for Work', tokens: 86000, pct: 43, color: '#86efac', desc: '실제 작업에 사용 가능한 공간' },
]

export const contextTips = [
  {
    concept: 'CLAUDE.md',
    icon: '📄',
    problem: 'CLAUDE.md가 너무 길면 매 대화마다 수천 토큰을 소비합니다.',
    solution: '50-70줄 유지. 세부 규칙은 .claude/rules/*.md로 분리 후 참조만.',
    impact: '절약',
    impactColor: '#86efac',
  },
  {
    concept: 'Sub-Agents',
    icon: '🤖',
    problem: '메인 대화에서 테스트 수정, 컨벤션 검증을 모두 처리하면 컨텍스트가 빠르게 오염됩니다.',
    solution: 'Sub-Agent는 독립된 컨텍스트 창에서 실행. 메인 대화에는 최종 결과만 반환.',
    impact: '격리',
    impactColor: '#7dd3fc',
  },
  {
    concept: 'Skills',
    icon: '⚡',
    problem: '매 대화마다 "커밋할 때 이런 형식으로 해줘..."를 반복 설명하면 낭비입니다.',
    solution: 'SKILL.md에 한 번만 정의. /commit 트리거 시 필요한 순간에만 주입.',
    impact: '효율',
    impactColor: '#d97757',
  },
  {
    concept: 'Hooks',
    icon: '🪝',
    problem: '포맷팅, 테스트 결과를 대화 안에서 처리하면 툴 결과 토큰이 누적됩니다.',
    solution: 'PostToolUse Hook에서 처리하면 대화 컨텍스트를 거치지 않음.',
    impact: '우회',
    impactColor: '#a78bfa',
  },
]

export const contextWindowFacts = [
  {
    stat: '200K',
    label: 'Claude 3.5/3.7 컨텍스트',
    desc: '약 15만 단어. 충분해 보이지만 긴 코드베이스 읽기, 대화 누적으로 빠르게 소모됩니다.',
  },
  {
    stat: '≈750',
    label: '영어 단어당 토큰',
    desc: '한국어는 1-2 단어가 1토큰. CLAUDE.md 100줄 ≈ 약 3,000~5,000 토큰.',
  },
  {
    stat: '100%',
    label: '대화 히스토리 포함',
    desc: 'Claude Code는 매 요청마다 이전 대화 전체를 포함합니다. 길어질수록 비용·지연이 증가.',
  },
]
