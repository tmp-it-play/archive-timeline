---
id: "ai-con-012"
title: "주요 LLM 모델 비교 (2026년 3월 기준)"
difficulty: "junior"
category: "ai_dev"
type: "concept"
---

## 글로벌 프론티어 모델 (2026 최신)

| 모델                    | 제공사       | 컨텍스트 | 출시         | 특징                         |
|-----------------------|-----------|------|------------|----------------------------|
| **GPT-5.4 Pro**       | OpenAI    | 128K | 2026.03.05 | SWE-bench 71.7%, 컴퓨터 직접 조작 |
| **GPT-5.3 Codex**     | OpenAI    | 128K | 2026.02    | CLI/터미널 코딩 특화              |
| **Gemini 3.1 Pro**    | Google    | 2M   | 2026.02.19 | GPQA 94.3%, 비용 효율          |
| **Claude Opus 4.6**   | Anthropic | 200K | -          | 코딩·분석, SWE-bench 80.9      |
| **Claude Sonnet 4.6** | Anthropic | 200K | -          | Claude Code 기반, 빠른 응답      |

## GPT-5.4 (OpenAI)

- **출시**: 2026년 3월 5일
- **두 가지 변형**: GPT-5.4 Thinking (추론 강화), GPT-5.4 Pro (범용)
- **주요 성능**:
  - SWE-bench Verified: **71.7%** (실제 GitHub 이슈 해결)
  - OSWorld: **75.0%** (데스크톱 앱·브라우저 직접 조작)
  - GPT-5.2 대비 사실 오류 **33% 감소**
- **특징**: **네이티브 컴퓨터 사용(Computer Use)** — 마우스·키보드 조작, 멀티 소프트웨어 워크플로 자동화
- **Artificial Analysis Intelligence Index**: 57점 (Gemini 3.1 Pro와 동점)

## GPT-5.3 Codex (OpenAI)

- **출시**: 2026년 2월 초
- **특화**: CLI/터미널 워크플로 코딩 모델
- **특징**: 채팅 인터페이스가 아닌 **개발자 환경(터미널) 직접 내장** 패러다임
- **Intelligence Index**: 54점

## Gemini 3.1 Pro (Google)

- **출시**: 2026년 2월 19일
- **컨텍스트**: **2M 토큰** (GPT-5.4의 15배 이상)
- **주요 성능**:
  - GPQA Diamond: **94.3%** (대학원 수준 과학 추론)
  - Intelligence Index: **57점** (GPT-5.4 Pro와 동점, 비용은 1/3)
- **특징**: Gemini CLI · Google Antigravity IDE의 기반 모델
- **SWE-bench**: 63.8% (GPT-5.4 대비 낮으나 비용 대비 우수)

## Claude 4.x (Anthropic)

- **Claude Opus 4.6**: SWE-bench Verified 80.9 (코딩 최상위), 복잡한 추론
- **Claude Sonnet 4.6**: Claude Code 기반, 빠른 응답 + 코딩 우수
- **컨텍스트**: 200K 토큰
- **특징**: MCP 에코시스템 선도, 에이전트 작업 안정성

---

## 중국 오픈소스 모델 (2026 급부상)

### GLM-5 (Zhipu AI / Z.AI)

- **파라미터**: 744B 총량 / **40B 활성** (MoE)
- **컨텍스트**: 200K 토큰
- **특징**: Huawei Ascend 910B 칩 독자 학습 (NVIDIA 완전 독립), 28.5조 토큰 학습
- **벤치마크**: SWE-bench Verified **77.8** (Claude Opus 4.6의 80.9에 근접)
- **용도**: 프로덕션, Tool 연동 안정성 우수

### Kimi K2.5 (Moonshot AI)

- **파라미터**: 1T 총량 / **32B 활성** (MoE)
- **컨텍스트**: **256K 토큰** (중국 모델 최대)
- **벤치마크**: HumanEval **99.0**, MMLU **92.0**, MATH-500 **98.0**
- **용도**: 오케스트레이터, 대형 추론 작업 (Oh My OpenCode 기본 오케스트레이터)

### MiniMax M2.7 (MiniMax)

- **파라미터**: **10B 활성** (경량 고효율)
- **출시**: 2026년 3월 17일
- **벤치마크**: SWE-bench Verified **80.2** (중국 모델 1위), Vals Index 59.58%
- **비용**: Claude Opus 대비 입력 **16.7배**, 출력 **22.7배** 저렴
- **용도**: 빠른 속도, 반복 작업, 비용 최적화

### Qwen 3.5 (Alibaba)

- **특징**: 멀티언어 (한국어 포함 아시아 언어 우수), 오픈소스 상업 사용 가능
- **용도**: 다국어 애플리케이션

---

## MoE (Mixture of Experts) 구조

중국 주요 모델이 공통으로 사용하는 아키텍처입니다.

```
전체 파라미터 중 추론 시 일부만 활성화

GLM-5:     744B 중 40B 활성  (5.4%)
Kimi K2.5: 1T   중 32B 활성  (3.2%)
MiniMax:        10B 활성     (경량)
```

→ 전체 파라미터 수준의 성능 + 활성 파라미터 기준의 낮은 추론 비용

---

## 용도별 선택 가이드 (2026)

```
실제 코딩 이슈 해결     → GPT-5.4 Pro (71.7% SWE-bench)
컴퓨터 직접 조작 자동화  → GPT-5.4 Pro (Computer Use)
초대형 문서·코드베이스   → Gemini 3.1 Pro (2M 컨텍스트)
비용 최적화             → MiniMax M2.7 (16~22배 저렴)
에이전트 오케스트레이터  → Kimi K2.5 / Claude Opus 4.6
CLI 코딩 특화           → GPT-5.3 Codex / Claude Code
한국어·다국어           → Qwen 3.5
```
