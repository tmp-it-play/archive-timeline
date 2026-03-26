---
id: "ai-mcq-027"
title: "Agent Team에서 모델 혼합(Model Mixing) 전략을 쓰는 주된 이유는?"
difficulty: "senior"
category: "ai_dev"
type: "mcq"
options:
  - text: "Orchestrator에는 고성능 모델을, 단순 반복 Worker에는 저비용 모델을 써서 비용과 성능을 균형 있게 유지하기 위해"
    correct: true
  - text: "동일 모델을 여러 번 호출하면 API Rate Limit에 걸리기 때문에"
    correct: false
  - text: "서로 다른 회사의 모델을 섞으면 저작권 문제를 피할 수 있기 때문에"
    correct: false
  - text: "여러 모델의 답변을 평균 내면 항상 더 정확하기 때문에"
    correct: false
---

Model Mixing의 핵심은 **역할별 비용·성능 최적화**입니다.

```
Orchestrator   → Claude Opus / Kimi K2.5  (복잡한 계획·판단, 고성능)
일반 Worker    → Claude Sonnet            (적정 성능, 중간 비용)
빠른 단순 작업 → MiniMax M2.7             (초저비용, 고속)
창의 작업      → Gemini 3.1 Pro           (대용량 컨텍스트)
```

Oh My OpenCode의 Sisyphus가 이 전략을 구현합니다.
모든 에이전트에 Opus급 모델을 쓰면 성능은 유지되지만 비용이 수십 배 증가합니다.
