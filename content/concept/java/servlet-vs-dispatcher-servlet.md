---
id: "java-con-022"
title: "Servlet과 DispatcherServlet의 차이"
difficulty: "mid"
category: "java"
type: "concept"
---

## Servlet

- Java 웹의 기본 요청 처리 단위
- Servlet 스펙에 따라 동작

## DispatcherServlet

- Spring MVC가 제공하는 특별한 Servlet
- 단순 요청 처리보다, Spring MVC 전체 요청 흐름을 조율함

## 차이의 핵심

- Servlet: 기반 기술
- DispatcherServlet: Spring MVC의 중앙 조정자

## 면접 포인트

- DispatcherServlet도 결국 Servlet이지만, 역할이 훨씬 더 프레임워크 중심적이라는 점을 말하면 좋습니다.
