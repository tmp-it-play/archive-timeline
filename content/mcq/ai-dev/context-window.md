---
id: "ai-mcq-003"
title: "컨텍스트 윈도우(Context Window)가 꽉 찰 때 발생하는 현상으로 가장 적절한 것은?"
difficulty: "junior"
category: "ai_dev"
type: "mcq"
options:
  - text: "오래된 대화 내용이 잘려 나가 이전 맥락을 참조하지 못하게 된다."
    correct: true
  - text: "API 응답이 자동으로 중단되고 새 세션이 시작된다."
    correct: false
  - text: "모델이 무조건 오류 코드를 반환한다."
    correct: false
  - text: "출력 토큰 수가 0으로 줄어든다."
    correct: false
---

컨텍스트 윈도우는 LLM이 한 번에 처리할 수 있는 최대 토큰 수입니다.
초과 시 오래된 내용부터 **트런케이션(Truncation)**이 발생해 "기억 손실"이 생깁니다.
이를 해결하기 위해 **요약(Summarization)**, **RAG**, **Prompt Caching** 기법을 활용합니다.
