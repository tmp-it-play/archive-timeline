---
id: "java-con-021"
title: "DispatcherServlet은 왜 중요한가"
difficulty: "junior"
category: "java"
type: "concept"
---

## DispatcherServlet이란?

Spring MVC의 프론트 컨트롤러 역할을 하는 핵심 Servlet입니다.

## 하는 일

- 모든 요청의 진입점 역할
- 어떤 컨트롤러가 처리할지 찾음
- 적절한 방식으로 컨트롤러 실행
- 결과를 응답으로 변환

## 왜 프론트 컨트롤러가 좋은가?

- 공통 흐름을 한 곳에서 관리 가능
- 인증, 예외 처리, 요청 매핑 같은 로직을 일관되게 다룰 수 있음

## 면접 포인트

- DispatcherServlet은 Spring MVC 요청 흐름의 중심이라고 설명하면 됩니다.
