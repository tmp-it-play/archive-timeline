---
id: "ai-con-003"
title: "AI 코딩 도구 비교 (Claude Code · Copilot · Gemini CLI · Codex)"
difficulty: "junior"
category: "ai_dev"
type: "concept"
---

## 주요 AI 코딩 도구 한눈에 보기

| 도구                 | 제공사                | 방식               | 주력 기능         |
|--------------------|--------------------|------------------|---------------|
| **GitHub Copilot** | GitHub / Microsoft | IDE 플러그인         | 인라인 코드 자동완성   |
| **Claude Code**    | Anthropic          | CLI / IDE 확장     | 에이전트 기반 코딩    |
| **Gemini CLI**     | Google             | CLI              | 터미널 AI 어시스턴트  |
| **Codex**          | OpenAI             | API              | 코드 생성 기반 모델   |
| **Cursor**         | Anysphere          | IDE (VS Code 포크) | 코드베이스 이해 + 편집 |

## GitHub Copilot

- **기반 모델**: GPT-4o, Claude, Gemini (멀티 모델 지원, 2024~)
- **핵심 기능**: 코드 인라인 자동완성, 채팅, PR 요약
- **특징**: IDE(VS Code, JetBrains 등) 깊은 통합, 가장 대중적
- **한계**: 에이전트 자율 실행보다는 제안/완성 중심

## Claude Code

- **기반 모델**: Claude (Anthropic)
- **핵심 기능**: 파일 읽기/쓰기/실행, git 조작, MCP 서버 연동, 에이전트 루프
- **특징**: CLI + VS Code / JetBrains 확장, Skills(슬래시 명령), Hooks(이벤트 훅)
- **차별점**: 대규모 코드베이스 리팩토링·분석에 강함

## Gemini CLI

- **기반 모델**: Gemini 2.5 Pro (Google)
- **핵심 기능**: 터미널에서 파일 탐색·편집·웹 검색·코드 실행
- **특징**: 1M 컨텍스트 윈도우, 무료 티어(개인 Google 계정), 오픈소스
- **출시**: 2025년 6월 공개

## OpenAI Codex

- **역할**: OpenAI의 코드 특화 모델 계열 (현재는 GPT-4o에 통합)
- **역사**: 2021년 출시 → GitHub Copilot 초기 버전의 기반 → 2023년 API 공식 종료
- **현재**: `codex` CLI 도구가 2025년 재출시 (에이전트 기반, GPT-4.1 사용)

## 선택 기준

```
인라인 자동완성 최우선  → GitHub Copilot
에이전트 자율 작업      → Claude Code
무료 + 대용량 컨텍스트  → Gemini CLI
VS Code 통합 코드베이스 → Cursor
```
