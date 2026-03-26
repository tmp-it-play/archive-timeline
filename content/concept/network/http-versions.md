---
id: "net-con-025"
title: "HTTP/1.1, HTTP/2, HTTP/3 차이"
difficulty: "mid"
category: "network"
type: "concept"
---

## HTTP/1.1

- 가장 오래 널리 사용된 버전
- keep-alive 지원
- 요청 다중화 한계로 HOL blocking 문제가 있음

## HTTP/2

- 바이너리 프레이밍
- 멀티플렉싱
- 헤더 압축
- 하나의 연결에서 여러 요청/응답 처리 가능

## HTTP/3

- QUIC 기반
- TCP가 아니라 UDP 기반 전송 위에서 동작
- 연결 수립 지연과 HOL 문제 개선을 목표로 함

## 면접 포인트

- HTTP/2는 TCP 기반, HTTP/3는 QUIC/UDP 기반이라는 점을 구분하면 좋습니다.
