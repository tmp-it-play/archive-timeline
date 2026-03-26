---
id: "ai-con-013"
title: "Google Antigravity — 에이전트 우선 IDE"
difficulty: "junior"
category: "ai_dev"
type: "concept"
---

## Antigravity란?

Google이 2025년 11월 18일 **Gemini 3과 함께 발표한 에이전트 우선(Agent-First) IDE**입니다. VS Code를 기반으로 크게 수정된 포크이며, 복잡한 코딩 작업을 자율 AI 에이전트에게 위임하는 것을 핵심 철학으로 삼습니다.

## 두 가지 뷰(View)

### Editor View

기존 IDE처럼 사용하는 동기(Synchronous) 작업 공간입니다.
- 탭 자동완성, 인라인 AI 명령
- 익숙한 파일 탐색·편집 경험

### Manager View

여러 에이전트를 병렬로 실행하고 감독하는 **컨트롤 센터**입니다.
- 에이전트가 여러 작업을 비동기(Asynchronous)로 동시 처리
- **Artifacts**: 에이전트가 생성한 작업 목록, 구현 계획, 스크린샷, 브라우저 녹화본 등 결과물을 시각적으로 확인

```
Manager View
    ├── Agent A: API 엔드포인트 구현 중...
    ├── Agent B: 테스트 작성 중...
    └── Agent C: 문서화 진행 중...
```

## 지원 모델

| 모델                           | 제공사            |
|------------------------------|----------------|
| Gemini 3.1 Pro               | Google (기본)    |
| Gemini 3 Flash               | Google (빠른 응답) |
| Claude Sonnet 4.6 / Opus 4.6 | Anthropic      |
| GPT-OSS-120B                 | OpenAI 오픈소스 변형 |

## Artifacts 시스템

에이전트의 투명성 문제를 해결합니다. 에이전트가 실행 중 다음을 생성합니다.
- 작업 분해 목록
- 구현 계획서
- 브라우저 자동화 녹화본

→ 개발자가 에이전트 로직을 한눈에 검증 가능

## AI IDE 비교

| IDE | 제공사 | 기반 | 특징 |
|-----|-------|------|------|
| **Antigravity** | Google | VS Code 포크 | 에이전트 병렬 실행, Gemini 3 |
| **Cursor** | Anysphere | VS Code 포크 | 코드베이스 이해, 가장 대중적 |
| **Claude Code** | Anthropic | CLI + 확장 | 에이전트 루프, MCP |
| **Windsurf** | Codeium | VS Code 포크 | Cascade 에이전트 |
| **GitHub Copilot** | Microsoft | 플러그인 | 자동완성 중심 |

## 현재 상태 (2026)

- **개인 사용자**: 무료 (Public Preview)
- **한계**: 프로토타이핑·탐색 중심. 프로덕션 전체 적용은 아직 초기 단계
