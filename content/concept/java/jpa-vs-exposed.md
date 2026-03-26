---
id: "java-con-008"
title: "JPA 대신 Exposed를 선택할 때 생각할 점"
difficulty: "mid"
category: "java"
type: "concept"
---

## JPA/Hibernate

- 엔티티와 영속성 컨텍스트 중심
- 객체 그래프 탐색과 변경 감지에 강점
- 복잡한 도메인 모델을 다루기 좋음

## Exposed

- Kotlin 친화적인 ORM/SQL DSL
- DAO 방식과 DSL 방식을 제공
- JPA보다 SQL에 더 가까운 감각으로 다루기 쉬운 편

## 왜 Exposed를 고를 수 있나?

- Kotlin 생태계와 잘 맞음
- JPA의 영속성 컨텍스트, 지연 로딩, 프록시 복잡도를 피하고 싶을 수 있음
- DSL 기반으로 쿼리를 더 명시적으로 제어하고 싶을 수 있음

## DAO vs DSL

### DAO
- 엔티티 객체 중심 접근
- JPA와 비슷한 사용감이 일부 있음

### DSL
- SQL에 더 가까운 스타일
- 복잡한 조회와 제어가 더 명시적

## 면접 포인트

- "JPA가 싫어서"가 아니라, 프로젝트 요구에 따라 추상화 수준과 제어 수준을 선택했다고 설명하는 게 좋습니다.
