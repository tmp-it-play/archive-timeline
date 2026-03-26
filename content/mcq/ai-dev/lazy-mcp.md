---
id: "ai-mcq-018"
title: "Lazy MCP가 해결하는 핵심 문제는?"
difficulty: "senior"
category: "ai_dev"
type: "mcq"
options:
  - text: "MCP 서버를 많이 연결할수록 모든 도구 스키마가 컨텍스트에 주입되어 토큰을 낭비하는 문제"
    correct: true
  - text: "MCP 서버 간 인증·권한 관리가 표준화되지 않은 문제"
    correct: false
  - text: "MCP 도구 실행 결과가 JSON이 아닌 형식으로 반환되는 호환성 문제"
    correct: false
  - text: "원격 MCP 서버와 로컬 MCP 서버를 동시에 사용할 수 없는 문제"
    correct: false
---

Lazy MCP는 MCP 프록시 서버로, **지연 로딩(Lazy Loading)**을 적용해 에이전트가 실제로 필요한 도구만 컨텍스트에 불러옵니다.

- `get_tools_in_category(path)`: 트리 구조로 도구 탐색
- `execute_tool(tool_path, arguments)`: 특정 도구 실행

실제 사례에서 2개의 MCP 도구를 숨기는 것만으로 Claude Code 컨텍스트의 **17%(34,000 토큰)를 절약**했습니다.
컨텍스트가 클수록, 연결한 MCP 서버가 많을수록 Lazy MCP의 효과가 커집니다.
