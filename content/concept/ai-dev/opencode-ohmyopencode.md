---
id: "ai-con-011"
title: "OpenCode & Oh My OpenCode"
difficulty: "mid"
category: "ai_dev"
type: "concept"
---

## OpenCode란?

**터미널 기반 오픈소스 AI 코딩 에이전트**입니다. Claude Code와 유사하지만 완전 오픈소스(MIT)이며 다양한 LLM 모델을 연결해 사용할 수 있습니다.

```bash
# 설치
npm install -g opencode-ai

# 실행
opencode
```

| 항목 | 내용 |
|------|------|
| 라이선스 | MIT (오픈소스) |
| 인터페이스 | 터미널 TUI |
| 모델 지원 | Claude, GPT, Gemini, 로컬 모델 등 |
| MCP 지원 | O |

## Oh My OpenCode란?

OpenCode를 **멀티 에이전트 엔지니어링 시스템**으로 변환하는 커뮤니티 플러그인입니다. npm 패키지로 설치합니다.

```bash
npm install -g oh-my-opencode
```

## 핵심 구성: Sisyphus 오케스트레이션

Oh My OpenCode의 핵심 시스템. 작업을 **병렬 백그라운드 실행**으로 처리합니다.

```
사용자 요청
    → Sisyphus Orchestrator
        ├── Engineering Agent  (코드 구현)
        ├── Review Agent       (코드 리뷰)
        ├── Testing Agent      (테스트 작성)
        ├── Docs Agent         (문서화)
        └── ... (총 11개 전문 에이전트)
```

## 11개 전문 에이전트

각 에이전트는 **역할별로 최적화된 모델·프롬프트·Tool 권한**을 사용합니다.

| 모델 계열 | 담당 역할 |
|----------|---------|
| Claude / Kimi / GLM | 오케스트레이션, 복잡한 추론 |
| GPT (OpenAI) | 논리 추론, 계획 수립 |
| Gemini (Google) | 창의적 작업, 대용량 컨텍스트 |
| Minimax | 빠른 속도가 필요한 작업 |

## 실제 사용 사례

- 45,000줄 Tauri 앱을 SaaS 웹앱으로 하룻밤에 변환
- ESLint 경고 8,000개를 하루 만에 자동 해결
- 대규모 리팩토링, 마이그레이션 자동화

## OpenCode vs Claude Code

| 항목 | OpenCode | Claude Code |
|------|---------|-------------|
| 라이선스 | MIT 오픈소스 | 비공개 |
| 모델 | 다중 모델 지원 | Claude 전용 |
| 멀티 에이전트 | Oh My OpenCode로 확장 | 기본 제공 |
| 비용 | 모델 API 비용만 | Anthropic 구독 필요 |
