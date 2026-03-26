---
id: "ai-con-012"
title: "주요 LLM 모델 비교 (2026 기준)"
difficulty: "junior"
category: "ai_dev"
type: "concept"
---

## 글로벌 주요 모델

| 모델 | 제공사 | 컨텍스트 | 특징 |
|------|-------|---------|------|
| **Claude Sonnet 4.6** | Anthropic | 200K | 코딩·분석, Claude Code 기반 |
| **Claude Opus 4.6** | Anthropic | 200K | 최고 품질, 복잡한 추론 |
| **GPT-4o** | OpenAI | 128K | 멀티모달, 범용 |
| **GPT-4.1** | OpenAI | 128K | Codex CLI 기반, 코딩 특화 |
| **Gemini 2.5 Pro** | Google | 1M+ | 초대용량 컨텍스트, Gemini CLI 기반 |

## 중국 오픈소스 모델 (2026 급부상)

### GLM-5 (Zhipu AI / Z.AI)

- **파라미터**: 744B 총량 / 40B 활성 (MoE 구조)
- **컨텍스트**: 200K 토큰
- **특징**: Huawei Ascend 910B 칩 독자 학습 (NVIDIA 비의존), 28.5조 토큰 학습
- **벤치마크**: SWE-bench Verified 77.8 (Claude Opus 4.6의 80.9에 근접)
- **용도**: 프로덕션 환경, Tool 연동 안정성 우수

### Kimi K2.5 (Moonshot AI)

- **파라미터**: 1조(1T) 총량 / 32B 활성
- **컨텍스트**: 256K 토큰 (중국 모델 중 최대)
- **특징**: 멀티모달(비전), 오케스트레이션 특화
- **벤치마크**: HumanEval 99.0, MMLU 92.0, MATH-500 98.0 (최상위권)
- **용도**: Oh My OpenCode 오케스트레이터로 활용

### MiniMax M2.7

- **파라미터**: 10B 활성 (경량 고효율)
- **특징**: 비용 효율 압도적 (Claude Opus 대비 입력 16.7배, 출력 22.7배 저렴)
- **벤치마크**: SWE-bench Verified 80.2 (중국 모델 1위), Vals Index 59.58%
- **출시**: 2026년 3월 17일
- **용도**: 빠른 응답이 필요한 반복 작업, 비용 최적화

### Qwen 3.5 (Alibaba)

- **특징**: 멀티언어 강점, 한국어 포함 아시아 언어 우수
- **라이선스**: 오픈소스 (상업 사용 가능)
- **용도**: 한국어 포함 다국어 애플리케이션

## MoE (Mixture of Experts) 구조

중국 모델들이 공통으로 사용하는 효율적 아키텍처입니다.

```
전체 파라미터 중 추론 시 일부만 활성화

GLM-5:    744B 중 40B 활성  (5.4% 활성)
Kimi K2.5: 1T 중 32B 활성   (3.2% 활성)
```

전체 파라미터 수만큼의 성능을 유지하면서 추론 비용은 활성 파라미터 기준으로 낮출 수 있습니다.
