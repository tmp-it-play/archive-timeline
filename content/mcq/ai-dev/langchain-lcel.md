---
id: "ai-mcq-005"
title: "LangChain LCEL(LangChain Expression Language)에서 | 연산자의 의미는?"
difficulty: "mid"
category: "ai_dev"
type: "mcq"
options:
  - text: "왼쪽 컴포넌트의 출력을 오른쪽 컴포넌트의 입력으로 연결하는 파이프라인을 구성한다."
    correct: true
  - text: "두 컴포넌트를 OR 조건으로 실행해 먼저 성공하는 결과를 사용한다."
    correct: false
  - text: "두 체인을 병렬로 실행하고 결과를 합친다."
    correct: false
  - text: "파이썬의 비트 OR 연산과 동일하게 동작한다."
    correct: false
---

LCEL의 `|` 연산자는 Unix 파이프(|)에서 영감을 받았습니다.

```python
chain = prompt | llm | output_parser
```

각 컴포넌트는 Runnable 인터페이스를 구현하며, 왼쪽의 출력이 오른쪽의 입력이 됩니다.
스트리밍, 배치 처리, 비동기 실행을 자동으로 지원합니다.
