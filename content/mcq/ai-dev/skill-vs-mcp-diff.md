---
id: "ai-mcq-022"
title: "Claude Code Skill과 MCP의 가장 근본적인 차이는?"
difficulty: "mid"
category: "ai_dev"
type: "mcq"
options:
  - text: "Skill은 프롬프트 템플릿(LLM 생성)이고, MCP는 외부 프로세스가 실제로 실행되는 도구 서버다."
    correct: true
  - text: "Skill은 유료 기능이고, MCP는 무료로 사용할 수 있다."
    correct: false
  - text: "Skill은 파일 시스템에 접근할 수 있고, MCP는 텍스트 생성만 가능하다."
    correct: false
  - text: "Skill은 여러 AI 앱에서 공유되고, MCP는 Claude Code에서만 사용 가능하다."
    correct: false
---

Skill과 MCP의 핵심 차이는 **실행 주체**입니다.

- **Skill**: 마크다운 파일로 작성한 프롬프트. Claude(LLM)가 읽고 텍스트를 생성. 외부 연동 불가, 부수 효과 없음.
- **MCP**: 별도 프로세스로 실행되는 서버. Claude가 Tool Call을 보내면 서버가 실제로 파일·DB·API에 접근. 부수 효과 발생.

MCP는 모든 MCP 지원 클라이언트에서 재사용 가능하며, Skill은 해당 Claude 인스턴스에서만 동작합니다.
