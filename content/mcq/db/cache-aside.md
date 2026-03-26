---
id: "db-mcq-004"
title: "Cache Aside 패턴에 대한 설명으로 가장 적절한 것은?"
difficulty: "mid"
category: "db"
type: "mcq"
options:
  - text: "먼저 캐시를 조회하고, 없으면 DB를 조회한 뒤 결과를 캐시에 채워 넣는 방식이다."
    correct: true
  - text: "항상 DB에만 쓰고 캐시는 절대 사용하지 않는 방식이다."
    correct: false
  - text: "캐시와 DB를 반드시 2PC로 묶는 방식이다."
    correct: false
  - text: "오직 쓰기 성능 향상을 위해서만 존재하는 패턴이다."
    correct: false
---

Cache Aside는 가장 흔한 캐시 패턴으로, 읽기 성능 최적화에 자주 사용됩니다.
