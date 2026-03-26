---
id: "ai-con-001"
title: "MCP (Model Context Protocol)"
difficulty: "mid"
category: "ai_dev"
type: "concept"
---

## MCP란?

**Model Context Protocol**은 Anthropic이 2024년 공개한 오픈 표준으로, LLM이 외부 도구·데이터와 상호작용하는 방식을 표준화합니다. "AI를 위한 USB-C"로 비유됩니다.

## 핵심 구조

MCP는 클라이언트-서버 아키텍처를 사용합니다.

```
[MCP Host (Claude, IDE 등)]
    └── MCP Client
            └── MCP Server ← 실제 도구/데이터 제공
```

## 3가지 기본 프리미티브

| 프리미티브 | 역할 | 예시 |
|----------|------|------|
| **Resources** | 읽기 전용 데이터 노출 | 파일, DB 레코드, API 응답 |
| **Tools** | 모델이 호출하는 함수(액션) | 파일 쓰기, 웹 검색, DB 쿼리 |
| **Prompts** | 재사용 가능한 프롬프트 템플릿 | 코드 리뷰 템플릿, 요약 지시문 |

## 기존 방식과의 차이

- **기존**: 각 AI 앱마다 도구 연동 코드를 별도로 구현
- **MCP**: 서버 한 번 구현 → 모든 MCP 지원 클라이언트에서 재사용

## 실무 활용 예시

```
Claude Code ─ MCP Server ─ GitHub API  (PR/이슈 조회)
                         ─ Postgres    (DB 직접 쿼리)
                         ─ Jira        (티켓 생성)
                         ─ Slack       (메시지 전송)
```

## 전송 방식

- **Stdio**: 로컬 프로세스 간 통신 (stdin/stdout)
- **SSE (Server-Sent Events)**: HTTP 기반 원격 서버 통신

## 보안 고려사항

- MCP 서버에 부여하는 권한은 최소 권한 원칙 적용
- 외부 MCP 서버는 신뢰도 검증 필요 (프롬프트 인젝션 위험)
- 민감한 자격 증명은 환경변수로 분리
