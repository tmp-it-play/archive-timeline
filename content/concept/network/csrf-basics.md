---
id: "net-con-021"
title: "CSRF란 무엇인가"
difficulty: "junior"
category: "network"
type: "concept"
---

## CSRF란?

Cross-Site Request Forgery.
사용자가 의도하지 않은 요청을, 인증된 상태를 이용해 보내게 만드는 공격입니다.

## 왜 가능한가?

브라우저가 자동으로 쿠키를 포함해 요청을 보낼 수 있기 때문입니다.

## 대응 방법

- CSRF 토큰
- SameSite 쿠키
- 민감 요청에 대한 추가 검증

## 면접 포인트

- XSS와 혼동하지 않고, "인증된 사용자의 의도하지 않은 요청"이라고 설명하면 좋습니다.
