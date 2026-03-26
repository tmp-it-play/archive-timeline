---
id: "java-con-030"
title: "@Transactional은 왜 AOP와 연결되는가"
difficulty: "mid"
category: "java"
type: "concept"
---

## 핵심

`@Transactional`은 보통 Spring AOP 프록시를 통해 동작합니다.

## 동작 흐름

1. 클라이언트가 프록시 Bean 호출
2. 프록시가 트랜잭션 시작
3. 실제 메서드 실행
4. 정상 종료 시 commit
5. 예외 발생 시 rollback

## 왜 self-invocation이 문제인가?

같은 클래스 내부에서 직접 호출하면 프록시를 우회하므로,
트랜잭션 Advice가 적용되지 않을 수 있습니다.

## 면접 포인트

- `@Transactional`을 단순 애너테이션 기능이 아니라, AOP 기반 부가 로직으로 이해하는 것이 중요합니다.
