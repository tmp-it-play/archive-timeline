---
id: "ai-con-006"
title: "Claude Code — Skills · Hooks · 에이전트 루프"
difficulty: "mid"
category: "ai_dev"
type: "concept"
---

## Claude Code란?

Anthropic의 공식 AI 코딩 CLI입니다. 단순 자동완성이 아니라 파일 읽기/쓰기, 터미널 명령 실행, git 조작, MCP 서버 연동까지 수행하는 **에이전트 코딩 도구**입니다.

## 에이전트 루프

Claude Code는 목표 달성까지 반복 루프를 돕니다.

```
사용자 요청
    → Claude가 계획 수립
    → 도구 사용 (파일 읽기/편집/실행)
    → 결과 관찰
    → 재계획 또는 완료
```

## Skills (슬래시 커맨드)

`/` 로 시작하는 사용자 정의 명령어입니다. 반복 작업을 재사용 가능한 프롬프트로 저장합니다.

```
/commit   → 커밋 메시지 자동 작성
/review   → 코드 리뷰 수행
/deploy   → 배포 전 체크리스트 실행
```

**저장 위치**: `.claude/skills/` 또는 `~/.claude/skills/` (전역)

Skill 파일은 마크다운 형식으로, 앞부분에 메타데이터를 포함합니다.

## Hooks

**특정 이벤트 발생 시 자동으로 실행되는 쉘 명령**입니다. Claude의 동작을 감시하거나 제어합니다.

| 훅 이름 | 실행 시점 |
|--------|---------|
| `PreToolUse` | 도구 실행 직전 (차단 가능) |
| `PostToolUse` | 도구 실행 직후 |
| `Notification` | Claude가 알림을 보낼 때 |
| `Stop` | Claude가 응답을 마칠 때 |
| `SubagentStop` | 서브에이전트가 종료될 때 |

```json
// settings.json 예시
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{ "type": "command", "command": "echo '명령 실행 전 로깅'" }]
    }]
  }
}
```

## CLAUDE.md

프로젝트 루트에 두는 **AI 지시문 파일**입니다. 코딩 컨벤션, 금지 동작, 프로젝트 구조를 기술하면 Claude가 매 대화에서 자동으로 참고합니다.

## MCP 통합

Claude Code는 MCP 서버를 연결해 기능을 확장합니다.

```
Claude Code ─ MCP ─ GitHub Server  → PR/이슈 직접 조작
                  ─ DB Server      → 스키마 조회/쿼리
                  ─ Browser Server → 웹 자동화
```

## 주요 CLI 옵션

| 옵션 | 설명 |
|------|------|
| `--model` | 사용할 Claude 모델 지정 |
| `--max-turns` | 에이전트 루프 최대 반복 수 |
| `-p` | 비대화 모드 (스크립트 파이프라인용) |
