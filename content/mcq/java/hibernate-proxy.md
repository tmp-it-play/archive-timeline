---
id: "java-mcq-003"
title: "Hibernate 프록시에 대한 설명으로 가장 적절한 것은?"
difficulty: "senior"
category: "java"
type: "mcq"
options:
  - text: "지연 로딩을 위해 실제 엔티티 대신 프록시 객체가 반환될 수 있으며, 준영속 상태에서 초기화 시 예외가 날 수 있다."
    correct: true
  - text: "프록시 객체는 항상 실제 엔티티와 완전히 동일한 클래스이므로 타입 문제는 절대 없다."
    correct: false
  - text: "프록시는 오직 2차 캐시가 켜져 있을 때만 생성된다."
    correct: false
  - text: "프록시는 데이터베이스 없이 메모리에서만 엔티티를 영구 저장하기 위한 구조다."
    correct: false
---

Hibernate는 지연 로딩을 위해 프록시를 사용합니다.
영속성 컨텍스트가 닫힌 뒤 프록시를 초기화하려 하면 예외가 발생할 수 있습니다.
