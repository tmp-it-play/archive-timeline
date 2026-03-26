---
id: "java-con-016"
title: "MyBatis는 언제 쓰고, JPA와 어떻게 다를까"
difficulty: "mid"
category: "java"
type: "concept"
---

## MyBatis란?

MyBatis는 SQL을 직접 작성하면서 객체 매핑을 도와주는 SQL Mapper 프레임워크입니다.

## 특징

- SQL을 명시적으로 제어 가능
- 복잡한 쿼리 튜닝에 유리
- 동적 SQL 작성 지원

## JPA와 차이

### MyBatis
- SQL 중심
- 쿼리 제어가 명확함
- 영속성 컨텍스트 개념이 없음

### JPA
- 객체 중심
- 엔티티 상태 관리, 변경 감지 지원
- 복잡한 내부 동작 이해가 필요함

## 면접 포인트

- MyBatis는 "SQL 제어력", JPA는 "객체 모델링 생산성" 관점으로 비교하면 좋습니다.
