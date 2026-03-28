---
id: "net-con-017"
title: "API 요청은 보통 어떤 순서로 흘러갈까"
difficulty: "junior"
category: "network"
type: "concept"
---

## 대표 흐름

1. 브라우저/클라이언트
2. DNS 조회
3. Load Balancer 또는 API Gateway
4. 웹 서버 / WAS / 애플리케이션 서버
5. 비즈니스 로직
6. DB / 캐시 / 외부 API
7. 응답 반환

## 왜 중요하나?

문제가 생겼을 때 어느 계층에서 병목이나 오류가 났는지 추적하기 쉬워집니다.

## 면접 포인트

- 한 줄로 "클라이언트가 서버에 요청한다"보다, 중간 계층을 단계적으로 설명하면 답변 밀도가 높아집니다.
