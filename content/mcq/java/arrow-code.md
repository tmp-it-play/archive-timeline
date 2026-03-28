---
id: "java-mcq-053"
title: "애로우 코드(Arrow Code)를 해결하는 방법으로 가장 적절하지 않은 것은?"
difficulty: "mid"
category: "java"
type: "mcq"
options:
  - text: "조건 분기가 복잡할수록 한 메서드에 모아서 전체 흐름을 한눈에 파악하도록 한다."
    correct: true
  - text: "Guard Clause를 사용해 실패 조건에서 조기 반환한다."
    correct: false
  - text: "중첩된 블록을 별도 메서드로 추출한다."
    correct: false
  - text: "Stream과 filter를 활용해 반복+조건 조합을 평탄화한다."
    correct: false
---

애로우 코드의 핵심 문제는 **깊은 중첩** 자체입니다. 조건 분기를 한 메서드에 모으는 것은 문제를 더 악화시킵니다. 올바른 해결책은 Guard Clause로 조기 반환하거나, 메서드를 추출하거나, Stream으로 평탄화하는 것입니다.
