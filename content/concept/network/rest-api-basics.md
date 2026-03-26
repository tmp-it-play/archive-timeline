---
id: "net-con-009"
title: "REST API란 무엇인가"
difficulty: "junior"
category: "network"
type: "concept"
---

## REST란?

REST는 웹의 자원을 URI로 표현하고, HTTP 메서드를 통해 상태를 다루는 아키텍처 스타일입니다.

## 핵심 요소

- 자원(Resource)을 URL로 표현
- HTTP Method로 행위 표현
- 무상태성(Stateless)
- 표현(Representation) 기반 통신

예:
- `GET /users/1`
- `POST /posts`
- `PATCH /users/1`

## RESTful하게 만든다는 의미

완벽한 규칙 암기보다도, 자원 중심 URL과 HTTP 의미를 일관되게 쓰는 것이 중요합니다.

## 면접 포인트

- REST는 "규격"이라기보다 아키텍처 스타일입니다.
- URL에 동사를 남발하기보다 자원을 표현하는 방향이 더 REST에 가깝습니다.
