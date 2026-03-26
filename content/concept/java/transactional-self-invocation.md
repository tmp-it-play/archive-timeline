---
id: "java-con-006"
title: "@Transactional 자가 호출이 왜 문제일까"
difficulty: "mid"
category: "java"
type: "concept"
---

## 문제 상황

같은 클래스 안에서 `this.someTransactionalMethod()`처럼 자기 자신의 메서드를 호출하면,
`@Transactional`이 기대대로 동작하지 않을 수 있습니다.

## 근본 원인

Spring의 `@Transactional`은 보통 **프록시 기반 AOP**로 동작합니다.
즉, 외부에서 프록시를 통해 메서드를 호출해야 트랜잭션 로직이 끼어듭니다.

하지만 자기 자신을 직접 호출하면 프록시를 거치지 않고 원본 메서드를 바로 호출하게 됩니다.

## 해결 방법

- 트랜잭션 메서드를 다른 빈으로 분리
- 프록시를 통해 호출되도록 구조 변경
- 필요하면 AOP 방식 자체를 바꾸는 방법도 고려

## 면접 포인트

- "Spring이 버그라서"가 아니라 프록시 기반 동작 구조 때문이라고 설명해야 합니다.
