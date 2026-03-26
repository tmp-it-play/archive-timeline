---
id: "net-con-012"
title: "PUT과 PATCH, 그리고 GET 요청 바디"
difficulty: "mid"
category: "network"
type: "concept"
---

## PUT

- 리소스 전체 교체 관점
- 멱등성을 기대하는 경우가 많음

## PATCH

- 리소스 일부 수정 관점
- 부분 변경에 적합

## GET 요청에 body를 넣어도 될까?

명세상 완전히 금지라고만 보긴 어렵지만, 일반적으로는 권장되지 않습니다.

이유:
- 많은 서버, 프록시, 캐시, 클라이언트가 GET body를 일관되게 처리하지 않음
- 의미가 모호해짐

그래서 보통 조회 조건은 query string을 사용합니다.

## 면접 포인트

- PUT은 전체 교체, PATCH는 부분 수정이라는 차이를 분명히 말하면 좋습니다.
