---
id: "java-con-052"
title: "Spring 테스트 슬라이스와 @SpringBootTest"
difficulty: "mid"
category: "java"
type: "concept"
---

## @SpringBootTest

애플리케이션 컨텍스트를 거의 전체로 띄워 테스트합니다.

장점:
- 실제와 가까움

단점:
- 느림
- 설정 부담이 큼

## 테스트 슬라이스

필요한 계층만 좁게 띄우는 방식입니다.

예:
- `@WebMvcTest`
- `@DataJpaTest`

## 언제 쓰나?

- 컨트롤러만 검증하고 싶다면 `@WebMvcTest`
- JPA 계층만 검증하고 싶다면 `@DataJpaTest`

## 면접 포인트

- 전체 통합 테스트와 슬라이스 테스트를 상황에 따라 나눠 쓰는 것이 중요합니다.
