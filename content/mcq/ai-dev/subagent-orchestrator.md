---
id: "ai-mcq-024"
title: "Orchestrator-Worker 멀티 에이전트 패턴에서 Orchestrator의 역할로 옳은 것은?"
difficulty: "mid"
category: "ai_dev"
type: "mcq"
options:
  - text: "전체 목표를 하위 작업으로 분해하고 Worker에게 위임한 후 결과를 취합·검증한다."
    correct: true
  - text: "각 하위 작업을 직접 실행하고 결과를 파일에 저장한다."
    correct: false
  - text: "Worker들의 API 비용을 모니터링하고 예산 초과 시 중단시킨다."
    correct: false
  - text: "사용자의 입력을 받아 단일 LLM 호출로 최종 응답을 생성한다."
    correct: false
---

Orchestrator-Worker 패턴에서 역할 분담은 명확합니다.

- **Orchestrator**: 계획·조율·최종 판단. 전체 목표를 DAG(방향성 비순환 그래프) 형태의 하위 작업으로 분해하고, 각 Worker에게 위임 후 결과를 취합합니다. 보통 가장 강력한 모델을 사용합니다.
- **Worker (Sub-Agent)**: 특정 하위 작업만 전담. 역할에 최적화된 모델과 도구 권한을 갖습니다.

Oh My OpenCode의 Sisyphus, Claude Code의 내부 Sub-Agent 모두 이 패턴을 따릅니다.
