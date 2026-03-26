---
id: "ai-mcq-025"
title: "멀티 에이전트 시스템에서 병렬 실행이 가능한 조건은?"
difficulty: "mid"
category: "ai_dev"
type: "mcq"
options:
  - text: "각 Sub-Agent의 작업이 서로의 결과에 의존하지 않고 독립적일 때"
    correct: true
  - text: "모든 Sub-Agent가 동일한 LLM 모델을 사용할 때"
    correct: false
  - text: "Orchestrator가 Sub-Agent보다 더 큰 컨텍스트 윈도우를 가질 때"
    correct: false
  - text: "작업 수가 2개 이하일 때만 병렬 실행이 안전하다."
    correct: false
---

병렬 실행의 핵심 조건은 **작업 간 독립성**입니다.

```
병렬 가능 ✓  →  A의 결과가 B에 필요하지 않음
순차 필요 ✗  →  B가 A의 결과를 입력으로 사용
```

예시:
- `테스트 파일 분석` + `문서 파일 분석` → 독립적 → **병렬 가능**
- `코드 작성` → `코드 리뷰` → 의존관계 → **순차 필요**

Oh My OpenCode의 Sisyphus는 DAG(방향성 비순환 그래프)로 의존관계를 파악해 독립 작업을 자동으로 병렬 실행합니다.
