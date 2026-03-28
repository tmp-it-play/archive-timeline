---
id: "net-con-018"
title: "HTTP 캐시와 캐시 관련 헤더"
difficulty: "junior"
category: "network"
type: "concept"
---

## 왜 중요한가?

HTTP 캐시는 응답 속도를 높이고 서버 부하를 줄이는 데 큰 역할을 합니다.

## 자주 보는 헤더

- `Cache-Control`
- `ETag`
- `Last-Modified`
- `If-None-Match`
- `If-Modified-Since`

## 대표 시나리오

클라이언트가 ETag를 가지고 재검증 요청을 보내면,
변경이 없을 때 서버는 `304 Not Modified`를 보낼 수 있습니다.

## 면접 포인트

- 캐시는 단순 성능 최적화가 아니라 HTTP 프로토콜 의미와 연결된 주제라고 설명하면 좋습니다.
