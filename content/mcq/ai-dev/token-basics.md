---
id: "ai-mcq-002"
title: "LLM의 토큰(Token)에 대한 설명으로 옳은 것은?"
difficulty: "junior"
category: "ai_dev"
type: "mcq"
options:
  - text: "토큰은 LLM이 텍스트를 처리하는 최소 단위로, 반드시 하나의 단어와 일치하지는 않는다."
    correct: true
  - text: "영어와 한국어는 같은 문자 수일 때 동일한 토큰 수를 가진다."
    correct: false
  - text: "토큰 수는 API 비용과 무관하다."
    correct: false
  - text: "하나의 문장은 항상 하나의 토큰으로 처리된다."
    correct: false
---

토큰은 LLM이 처리하는 기본 단위입니다. 영어는 약 4자 = 1토큰이지만, 한국어는 형태소 단위로 분리되어 **같은 내용이라도 더 많은 토큰**을 소비합니다.
"Hello"는 1토큰이지만 "안녕하세요"는 3~4토큰이 될 수 있습니다.
토큰 수는 API 호출 비용과 컨텍스트 윈도우 소비량에 직접 영향을 미칩니다.
