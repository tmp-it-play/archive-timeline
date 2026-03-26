---
id: "java-con-025"
title: "Filter의 역할과 언제 쓰는가"
difficulty: "junior"
category: "java"
type: "concept"
---

## Filter란?

Filter는 Servlet 스펙 레벨에서 요청과 응답을 가로채는 구성 요소입니다.
Spring MVC보다 바깥 계층에서 동작합니다.

## 주로 하는 일

- 인코딩 처리
- 공통 로깅
- 인증/인가 전처리
- CORS, 보안 헤더 처리

## 왜 중요한가?

Controller에 도달하기 전 단계에서 공통 로직을 적용할 수 있기 때문입니다.

## 면접 포인트

- Filter는 Spring 전용이 아니라 Servlet 기반 기술이라는 점을 말하면 좋습니다.
