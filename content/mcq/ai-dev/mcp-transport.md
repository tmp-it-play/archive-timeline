---
id: "ai-mcq-011"
title: "MCP 서버의 전송 방식 중 로컬 프로세스 간 통신에 사용되는 것은?"
difficulty: "mid"
category: "ai_dev"
type: "mcq"
options:
  - text: "Stdio (stdin/stdout)"
    correct: true
  - text: "WebSocket"
    correct: false
  - text: "gRPC"
    correct: false
  - text: "GraphQL Subscription"
    correct: false
---

MCP는 두 가지 전송 방식을 지원합니다.

- **Stdio**: 로컬 프로세스 간 stdin/stdout으로 통신. MCP Host와 같은 머신에서 실행되는 서버에 사용됩니다.
- **SSE (Server-Sent Events)**: HTTP 기반. 원격 MCP 서버와 통신할 때 사용됩니다.

로컬 도구(파일 시스템, 로컬 DB 등)는 보통 Stdio, 외부 API 서버는 SSE 방식을 채택합니다.
