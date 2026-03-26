---
id: "ai-con-014"
title: "MCP 심화 — Lazy MCP · 2026 로드맵 · 생태계"
difficulty: "senior"
category: "ai_dev"
type: "concept"
---

## MCP 생태계 현황 (2026)

- **월간 SDK 다운로드**: 9,700만 회 (Python + TypeScript 합산)
- **활성 MCP 서버**: 10,000개 이상
- **거버넌스 이관**: 2025년 12월 Anthropic이 MCP를 **Agentic AI Foundation(AAIF)**에 기증 (Linux Foundation 산하, Anthropic·Block·OpenAI 공동 창립)
- **OpenAI 채택**: 2025년 3월 ChatGPT 데스크톱 앱 등 전 제품에 MCP 통합

## Lazy MCP

### 문제: 도구가 많아질수록 컨텍스트 낭비

MCP 서버를 많이 연결할수록 모든 도구 정의가 컨텍스트에 주입되어 토큰을 낭비합니다.

```
기존 방식: 전체 도구 스키마가 항상 컨텍스트에 존재
→ 100개 도구 연결 시 수만 토큰 소비
```

### Lazy MCP의 해결책

[voicetreelab/lazy-mcp](https://github.com/voicetreelab/lazy-mcp) — MCP 프록시 서버로, **필요할 때만 도구를 불러오는 지연 로딩(Lazy Loading)** 방식을 적용합니다.

실제 사례: Claude Code에서 불필요한 MCP 도구 2개를 숨겨 **전체 컨텍스트의 17%(34,000 토큰)** 절약

### Lazy MCP가 노출하는 메타 도구 2개

| 메타 도구                                | 역할                  |
|--------------------------------------|---------------------|
| `get_tools_in_category(path)`        | 트리 구조로 사용 가능한 도구 탐색 |
| `execute_tool(tool_path, arguments)` | 경로로 도구 실행           |

에이전트가 필요한 도구 카테고리를 먼저 탐색한 후 특정 도구만 호출하는 방식입니다.

### Claude Code와 함께 사용 시 주의사항

Lazy MCP를 통해 도구를 실행하면 모든 호출이 `execute_tool`을 거칩니다. 기존 MCP 권한 규칙이 직접 적용되지 않으므로, **Claude Code Hooks**로 권한을 별도 제어해야 합니다.
