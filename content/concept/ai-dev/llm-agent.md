---
id: "ai-con-004"
title: "LLM Agent"
difficulty: "mid"
category: "ai_dev"
type: "concept"
---

## Agent란?

단순 텍스트 생성을 넘어, **목표 달성을 위해 스스로 계획하고 도구를 사용해 행동을 반복**하는 AI 시스템입니다.

```
일반 LLM:  질문 → 응답 (1회성)
Agent:      목표 → 계획 → 행동 → 관찰 → 재계획 → ... → 목표 달성
```

## ReAct 패턴

**Re**asoning + **Act**ing의 결합. LLM이 생각하고 행동하는 과정을 교차 반복합니다.

```
Thought: 어떤 파일이 있는지 먼저 확인해야겠다.
Action:  ls -la
Observation: main.py, utils.py, test_main.py 존재

Thought: main.py를 읽어보자.
Action:  read_file("main.py")
Observation: [파일 내용]

Thought: 버그를 찾았다. 수정하겠다.
Action:  edit_file(...)
```

## 핵심 구성 요소

| 구성 요소 | 역할 |
|---------|------|
| **LLM** | 계획·추론·의사결정 두뇌 |
| **Tools** | 외부 세계와 상호작용 (파일, API, DB, 검색) |
| **Memory** | 단기(컨텍스트), 장기(Vector DB, 외부 저장소) |
| **Planner** | 복잡한 목표를 하위 작업으로 분해 |

## Tool Calling (Function Calling)

LLM에게 "이런 함수들이 있어"라고 알려주면 LLM이 적절한 함수를 선택·호출합니다.

```json
// 도구 정의 예시
{
  "name": "search_web",
  "description": "웹에서 정보를 검색합니다",
  "parameters": {
    "query": { "type": "string" }
  }
}
```

## Multi-Agent 시스템

여러 에이전트가 협력하는 구조입니다.

```
Orchestrator Agent
    ├── Research Agent  (정보 수집)
    ├── Coding Agent    (코드 작성)
    └── Review Agent    (코드 검토)
```

## 에이전트의 한계

- **Hallucination**: 잘못된 정보로 행동할 위험
- **컨텍스트 한계**: 긴 작업에서 목표를 잃어버릴 수 있음
- **비결정성**: 같은 입력도 다른 결과를 낼 수 있음
- **보안**: Tool 호출 권한 관리 필요 (최소 권한 원칙)
