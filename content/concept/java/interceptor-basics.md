---
id: "java-con-026"
title: "Interceptor의 역할과 Filter와의 차이"
difficulty: "junior"
category: "java"
type: "concept"
---

## Interceptor란?

Interceptor는 Spring MVC 레벨에서 컨트롤러 호출 전후에 개입하는 구성 요소입니다.

## 주로 하는 일

- 인증 검사
- 권한 검사
- 요청 로깅
- 공통 모델 데이터 추가

## Filter와 차이

- Filter: Servlet 레벨
- Interceptor: Spring MVC 레벨

즉, Interceptor는 HandlerMapping 이후 Spring MVC 흐름 안에서 동작합니다.

## 면접 포인트

- Interceptor는 Controller에 더 가까운 위치에서 동작한다고 설명하면 좋습니다.
