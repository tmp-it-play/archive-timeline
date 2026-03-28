---
id: "net-con-022"
title: "SameSite 쿠키와 HttpOnly 쿠키"
difficulty: "junior"
category: "network"
type: "concept"
---

## SameSite

크로스 사이트 요청에 쿠키를 얼마나 포함할지 제어하는 속성입니다.

종류:
- `Strict`
- `Lax`
- `None`

## HttpOnly

JavaScript에서 쿠키에 접근하지 못하게 하는 속성입니다.
주로 XSS로 인한 쿠키 탈취 위험을 줄이는 데 도움을 줍니다.

## 핵심 차이

- SameSite: CSRF 관련
- HttpOnly: XSS로 인한 쿠키 접근 제한 관련

## 면접 포인트

- 둘은 역할이 다르므로, 하나로 모든 공격을 막는다고 말하면 안 됩니다.
