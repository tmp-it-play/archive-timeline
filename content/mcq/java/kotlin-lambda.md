---
id: "java-mcq-001"
title: "Kotlin 람다식에 대한 설명으로 올바른 것은?"
difficulty: "junior"
category: "java"
type: "mcq"
options:
  - text: "마지막 인자가 람다인 경우 괄호 밖으로 뺄 수 있다."
    correct: true
  - text: "람다식은 반드시 함수 이름을 가져야 한다."
    correct: false
  - text: "Kotlin 람다는 컬렉션의 filter, map 같은 고차 함수와 함께 쓸 수 없다."
    correct: false
  - text: "람다식은 오직 반환값이 없는 경우에만 사용할 수 있다."
    correct: false
---

Kotlin에서는 마지막 인자가 람다일 때 trailing lambda 문법을 사용할 수 있습니다.
예를 들어 `numbers.forEach { println(it) }` 같은 형태가 가능합니다.
