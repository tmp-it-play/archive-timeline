---
id: "ai-mcq-004"
title: "LLM Agent의 ReAct 패턴에서 'Act' 단계에 해당하는 것은?"
difficulty: "mid"
category: "ai_dev"
type: "mcq"
options:
  - text: "외부 도구(파일 읽기, 웹 검색 등)를 실제로 호출해 결과를 얻는다."
    correct: true
  - text: "최종 답변을 사용자에게 출력한다."
    correct: false
  - text: "다음 행동을 위한 추론 과정을 기록한다."
    correct: false
  - text: "이전 Observation을 요약해 저장한다."
    correct: false
---

ReAct(Reasoning + Acting) 패턴은 **Thought → Action → Observation** 사이클을 반복합니다.
- **Thought**: LLM이 상황을 분석하고 다음 행동을 계획 (추론)
- **Action**: 도구를 실제로 호출 (실행)
- **Observation**: 도구 실행 결과를 수신 (관찰)

이 사이클을 목표 달성까지 반복합니다.
