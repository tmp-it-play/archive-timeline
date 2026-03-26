---
id: "java-con-024"
title: "Spring AOP의 기본 개념"
difficulty: "mid"
category: "java"
type: "concept"
---

## Spring AOP는 어떻게 동작하나?

Spring AOP는 보통 프록시 기반으로 동작합니다.
즉, 대상 객체를 직접 호출하는 대신 프록시 객체를 거쳐 부가 로직을 실행합니다.

## 자주 나오는 용어

- Aspect: 공통 관심사 모듈
- Advice: 실제 부가 로직
- Join Point: 부가 로직이 적용될 수 있는 지점
- Pointcut: 적용할 지점을 고르는 조건

## 대표 활용

- `@Transactional`
- 로깅
- 실행 시간 측정
- 권한 검사

## 주의점

- 자기 자신을 직접 호출하는 self-invocation 문제
- 프록시 기반이라 모든 상황을 다 가로채는 것은 아님

## 면접 포인트

- Spring AOP는 AspectJ 전체 기능이 아니라, 주로 메서드 실행 지점 중심의 프록시 기반 AOP라고 설명하면 좋습니다.
