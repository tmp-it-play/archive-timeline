---
id: "java-mcq-017"
title: "Spring AOP 기반 로깅이 인증 실패 요청을 잡지 못할 수 있는 이유는?"
difficulty: "senior"
category: "java"
type: "mcq"
options:
  - text: "인증 실패가 Filter/Security Filter Chain 단계에서 먼저 차단되면, AOP가 적용된 Bean 메서드까지 도달하지 않기 때문이다."
    correct: true
  - text: "AOP는 HTTP 요청을 항상 가장 먼저 처리하므로 인증 실패가 절대 발생하지 않는다."
    correct: false
  - text: "인증 실패 요청은 JVM 밖에서만 일어나기 때문이다."
    correct: false
  - text: "AOP는 성공한 요청만 로그를 남기도록 강제되어 있기 때문이다."
    correct: false
---

Spring AOP는 보통 Bean 메서드 실행 지점에 개입하므로, 그 이전 단계에서 차단된 요청은 잡지 못할 수 있습니다.
