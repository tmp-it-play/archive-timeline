---
id: "java-mcq-002"
title: "@Transactional 자가 호출이 기대대로 동작하지 않는 주된 이유는?"
difficulty: "mid"
category: "java"
type: "mcq"
options:
  - text: "프록시 기반 AOP가 자기 자신에 대한 직접 호출에는 개입하지 못하기 때문이다."
    correct: true
  - text: "@Transactional은 private 메서드에서만 동작하기 때문이다."
    correct: false
  - text: "트랜잭션은 항상 생성자에서만 시작할 수 있기 때문이다."
    correct: false
  - text: "Spring은 같은 클래스 안의 메서드를 전혀 호출할 수 없기 때문이다."
    correct: false
---

`@Transactional`은 보통 프록시를 거쳐 호출될 때 적용됩니다.
같은 클래스 내부에서 직접 호출하면 프록시를 우회해 트랜잭션 AOP가 동작하지 않을 수 있습니다.
