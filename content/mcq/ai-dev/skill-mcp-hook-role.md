---
id: "ai-mcq-023"
title: "Claude Code의 Skill, MCP, Hook 중 '이벤트 발생 시 자동으로 쉘 명령을 실행'하는 것은?"
difficulty: "mid"
category: "ai_dev"
type: "mcq"
options:
  - text: "Hook"
    correct: true
  - text: "Skill"
    correct: false
  - text: "MCP"
    correct: false
  - text: "CLAUDE.md"
    correct: false
---

Claude Code의 세 확장 메커니즘은 역할이 명확히 구분됩니다.

| 메커니즘 | 트리거 | 실행 내용 |
|---------|--------|---------|
| **Skill** | 사용자가 `/커맨드` 호출 | Claude가 프롬프트 템플릿 실행 (LLM) |
| **MCP** | Claude가 Tool Use 결정 | 외부 서버 프로세스가 도구 실행 |
| **Hook** | 특정 이벤트 자동 발생 | 쉘 명령 직접 실행 |

Hook은 `PreToolUse`, `PostToolUse`, `Stop` 같은 이벤트에 반응해 **사람의 개입 없이 자동으로** 쉘 스크립트를 실행합니다.
