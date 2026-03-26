---
id: "net-con-020"
title: "CORS란 무엇인가"
difficulty: "junior"
category: "network"
type: "concept"
---

## CORS란?

Cross-Origin Resource Sharing의 약자로,
브라우저가 다른 출처(origin)의 리소스 요청을 제한하고 예외적으로 허용하는 규칙입니다.

## 왜 필요한가?

브라우저는 기본적으로 동일 출처 정책(SOP)을 따릅니다.
그래서 다른 도메인, 포트, 프로토콜로 요청할 때 제약이 생깁니다.

## 어떻게 동작하나?

서버가 `Access-Control-Allow-Origin` 같은 헤더로 허용 여부를 알려줍니다.

## 면접 포인트

- CORS는 서버 보안 기능이라기보다, 브라우저 보안 정책과 관련된 제약이라고 설명하는 것이 중요합니다.
