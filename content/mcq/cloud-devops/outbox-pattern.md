---
id: "cloud-mcq-001"
title: "Outbox 패턴의 핵심 목적은 무엇인가?"
difficulty: "senior"
category: "cloud_devops"
type: "mcq"
options:
  - text: "비즈니스 데이터 저장과 이벤트 발행 대상을 같은 트랜잭션 안에 기록해 정합성 문제를 줄이기 위함이다."
    correct: true
  - text: "모든 분산 트랜잭션을 2PC로 강제하기 위함이다."
    correct: false
  - text: "메시지 브로커를 없애기 위해서다."
    correct: false
  - text: "DB 락을 완전히 제거하기 위해서다."
    correct: false
---

Outbox 패턴은 DB 커밋 이후 이벤트 발행 실패로 생기는 정합성 문제를 줄이기 위해 사용됩니다.
비즈니스 데이터와 이벤트 레코드를 함께 저장하고, 이후 별도 프로세스가 이벤트를 발행합니다.
