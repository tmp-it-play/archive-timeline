---
id: "ai-con-016"
title: "Sub-Agent & Agent Team — 멀티 에이전트 아키텍처"
difficulty: "mid"
category: "ai_dev"
type: "concept"
---

## 왜 단일 에이전트로는 부족한가?

| 한계 | 설명 |
|------|------|
| **컨텍스트 한계** | 긴 작업은 단일 컨텍스트 윈도우를 초과 |
| **병렬화 불가** | 순차 처리만 가능해 대규모 작업에 느림 |
| **역할 혼재** | 하나의 에이전트가 모든 일을 하면 품질 저하 |
| **격리 부재** | 한 작업의 실패가 전체에 영향 |

→ 이를 해결하는 것이 **Sub-Agent / Agent Team** 아키텍처

---

## Orchestrator-Worker 패턴

가장 기본적인 멀티 에이전트 구조입니다.

```
Orchestrator (오케스트레이터)
    ├── 전체 목표 분해
    ├── 하위 작업을 Worker에게 위임
    └── 결과 취합·검증

        ├── Worker A (Sub-Agent)
        ├── Worker B (Sub-Agent)
        └── Worker C (Sub-Agent)
```

- **Orchestrator**: 계획·조율·최종 판단 담당. 주로 가장 강력한 모델 사용
- **Worker (Sub-Agent)**: 특정 하위 작업 전담. 역할에 맞는 모델·Tool 권한 부여

---

## Claude Code의 Sub-Agent

Claude Code는 복잡한 작업을 처리할 때 **내부적으로 Sub-Agent를 생성**합니다.

```
사용자: "전체 테스트 커버리지를 90%로 올려줘"

Orchestrator Claude
    ├── Sub-Agent 1: 현재 테스트 파일 분석
    ├── Sub-Agent 2: 미커버 코드 파악
    ├── Sub-Agent 3: 테스트 코드 작성
    └── Sub-Agent 4: 결과 검증·리포트 생성
```

### SubagentStop Hook

Sub-Agent가 종료될 때 실행되는 훅으로, 각 서브 작업의 완료를 감지할 수 있습니다.

```json
{
  "hooks": {
    "SubagentStop": [{
      "hooks": [{ "type": "command", "command": "echo 'Sub-Agent 완료'" }]
    }]
  }
}
```

---

## Agent Team 설계 전략

### 1. 역할 기반 분리 (Role-Based)

```
Research Agent   → 정보 수집·검색
Planning Agent   → 구현 계획 수립
Coding Agent     → 코드 작성
Review Agent     → 코드 리뷰·검증
Testing Agent    → 테스트 작성·실행
```

### 2. 모델 혼합 (Model Mixing)

비용과 성능을 균형있게 유지합니다.

```
Orchestrator  → Claude Opus / Kimi K2.5  (고성능, 고비용)
Worker들      → Claude Sonnet / MiniMax  (적정 성능, 저비용)
빠른 단순 작업 → MiniMax M2.7            (초저비용, 빠른 속도)
```

### 3. 병렬 실행 (Parallel Execution)

독립적인 작업은 동시에 실행해 시간을 단축합니다.

```
순차:  A → B → C → D  (총 40분)
병렬:  A ─┐
          ├─ 동시 실행 → D  (총 15분)
       B ─┘
       C (독립)
```

---

## Oh My OpenCode의 Sisyphus

멀티 에이전트 오케스트레이션의 실제 구현 사례입니다.

```
Sisyphus (오케스트레이터)
    ├── 작업을 DAG(방향성 비순환 그래프)로 분해
    ├── 병렬 가능한 작업 동시 실행
    └── 11개 전문 에이전트에 역할별 위임

전문 에이전트 예:
    engineering  → 구현 (Claude/GLM)
    review       → 검토 (GPT)
    creative     → 아이디어 (Gemini)
    fast         → 빠른 단순 작업 (MiniMax)
```

---

## 격리와 컨텍스트 관리

각 Sub-Agent는 **독립된 컨텍스트**를 갖습니다.

```
Orchestrator Context (요약된 전체 맥락)
    ↕ (요약·핵심 정보만 전달)
Sub-Agent Context (해당 작업에 필요한 정보만)
```

**장점**: 컨텍스트 오염 방지, 각 작업에 최적화된 정보만 포함
**단점**: 에이전트 간 정보 공유가 어려울 수 있음 → 공유 메모리(Vector DB 등)로 해결

---

## 에이전트 간 통신 방식

| 방식 | 설명 | 예시 |
|------|------|------|
| **직접 호출** | Orchestrator가 Worker에게 직접 지시 | Claude Code 내부 |
| **메시지 큐** | 비동기 메시지로 작업 전달 | Kafka, RabbitMQ |
| **공유 저장소** | 파일·DB로 결과 공유 | 파일 시스템, Redis |
| **이벤트 기반** | 완료 이벤트로 다음 작업 트리거 | Webhook, Hook |

---

## 주의사항

- **무한 루프 방지**: `--max-turns` 등으로 반복 횟수 제한
- **비용 폭발**: 다수 에이전트 동시 실행 시 토큰 비용 급증
- **디버깅 어려움**: 분산 실행으로 원인 추적이 복잡
- **권한 최소화**: 각 Sub-Agent에 필요한 Tool 권한만 부여
