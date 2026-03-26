---
id: "java-con-012"
title: "Filter와 Interceptor의 차이"
difficulty: "junior"
category: "java"
type: "concept"
---

## Filter

- Servlet 스펙 레벨
- DispatcherServlet 이전에도 동작 가능
- 인코딩, 로깅, 공통 보안 처리 등에 사용

## Interceptor

- Spring MVC 레벨
- Controller 호출 전후에 개입
- 인증, 권한, 요청 로깅, 공통 모델 처리 등에 자주 사용

## 차이의 핵심

- Filter는 더 바깥 계층
- Interceptor는 Spring MVC 내부 계층

## 면접 포인트

- 실행 위치와 다루는 추상화 레벨이 다르다고 설명하면 좋습니다.
