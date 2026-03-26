---
id: "ai-mcq-026"
title: "멀티 에이전트 시스템에서 각 Sub-Agent가 독립된 컨텍스트를 갖는 이유는?"
difficulty: "senior"
category: "ai_dev"
type: "mcq"
options:
  - text: "컨텍스트 오염을 방지하고 각 작업에 필요한 정보만 포함해 품질과 비용 효율을 높이기 위해"
    correct: true
  - text: "여러 Sub-Agent가 동시에 같은 컨텍스트를 수정하면 충돌이 생기기 때문에"
    correct: false
  - text: "LLM API가 동시에 여러 컨텍스트를 처리하지 못하기 때문에"
    correct: false
  - text: "Orchestrator의 시스템 프롬프트를 Worker에게 숨기기 위해"
    correct: false
---

Sub-Agent의 컨텍스트 격리는 두 가지 이점을 제공합니다.

1. **컨텍스트 오염 방지**: Orchestrator의 전체 계획, 다른 Sub-Agent의 결과 등 불필요한 정보가 섞이지 않음 → 집중도 향상
2. **비용 효율**: 각 Sub-Agent는 자신의 작업에 필요한 정보만 포함 → 토큰 낭비 감소

에이전트 간 정보 공유가 필요할 경우에는 **공유 파일**, **Vector DB**, **Redis** 같은 외부 저장소를 통해 교환합니다.
컨텍스트를 완전 격리하면 디버깅이 어려워질 수 있으므로, Orchestrator는 핵심 요약만 전달하는 패턴이 일반적입니다.
