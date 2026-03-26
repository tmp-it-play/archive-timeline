---
id: "db-mcq-008"
title: "낙관적 락과 비관적 락 비교로 가장 적절한 것은?"
difficulty: "senior"
category: "db"
type: "mcq"
options:
  - text: "낙관적 락은 충돌이 드물다고 보고 버전 등으로 검증하고, 비관적 락은 미리 잠금을 걸어 충돌을 방지한다."
    correct: true
  - text: "두 방식은 항상 완전히 동일하게 동작한다."
    correct: false
  - text: "비관적 락은 읽기만 가능하고 쓰기는 불가능하게 만든다."
    correct: false
  - text: "낙관적 락은 데이터베이스 없이도 자동으로 정합성을 보장한다."
    correct: false
---

락 전략은 충돌 빈도와 정합성 요구 수준에 따라 선택해야 합니다.
