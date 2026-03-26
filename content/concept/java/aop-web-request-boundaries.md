---
id: "java-con-027"
title: "AOP 기반 로깅이 인증 실패 요청을 못 잡을 수 있는 이유"
difficulty: "senior"
category: "java"
type: "concept"
---

## 상황

Spring AOP로 컨트롤러나 서비스 메서드에 로깅을 걸었는데,
인증 실패나 필터 단계에서 차단된 요청은 로그가 안 남는 경우가 있습니다.

## 왜 그럴까?

Spring AOP는 보통 **Spring Bean 메서드 호출**에 프록시로 개입합니다.
하지만 인증 실패가 Filter나 Security Filter Chain에서 먼저 발생하면,
컨트롤러/서비스 메서드까지 아예 도달하지 못합니다.

즉:
- Filter 단계에서 차단
- AOP가 적용된 Bean 메서드는 호출되지 않음
- 따라서 AOP 로깅에도 안 잡힘

## 그럼 어떻게 해야 하나?

- 요청 전체를 보고 싶다면 Filter나 Interceptor 레벨 로깅을 고려
- 비즈니스 메서드 중심 추적은 AOP
- 둘을 목적에 따라 분리하는 것이 좋음

## 면접 포인트

- AOP는 메서드 호출 중심이고, Filter는 HTTP 요청 파이프라인 초입이라는 차이를 설명할 수 있어야 합니다.
