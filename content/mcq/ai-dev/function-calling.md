---
id: "ai-mcq-009"
title: "LLM의 Function Calling(Tool Use)에 대한 설명으로 옳지 않은 것은?"
difficulty: "mid"
category: "ai_dev"
type: "mcq"
options:
  - text: "LLM이 함수를 직접 실행하고 그 결과를 반환한다."
    correct: true
  - text: "개발자가 사용 가능한 함수 목록과 스키마를 LLM에게 제공한다."
    correct: false
  - text: "LLM은 어떤 함수를 어떤 인자로 호출할지 결정하고 JSON 형태로 반환한다."
    correct: false
  - text: "실제 함수 실행은 클라이언트(개발자 코드)가 담당한다."
    correct: false
---

Function Calling에서 **LLM은 직접 함수를 실행하지 않습니다.**

실제 흐름:
1. 개발자가 함수 목록·스키마를 LLM에게 제공
2. LLM이 "이 함수를 이 인자로 호출하라"는 JSON 반환
3. **개발자 코드(클라이언트)가** 해당 함수를 실제로 실행
4. 실행 결과를 LLM에게 다시 전달
5. LLM이 결과를 바탕으로 최종 응답 생성
