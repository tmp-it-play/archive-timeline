---
id: "net-con-007"
title: "HTTP와 HTTPS의 차이"
difficulty: "junior"
category: "network"
type: "concept"
---

## HTTP

- HyperText Transfer Protocol
- 기본적으로 평문 전송
- 중간에서 패킷을 보면 내용이 노출될 수 있음

## HTTPS

- HTTP over TLS
- TLS를 통해 암호화, 무결성, 인증을 제공

## 차이의 핵심

### HTTP
- 빠르게 시작 가능
- 하지만 민감 정보 보호에 부적합

### HTTPS
- 인증서 검증과 암호화가 추가됨
- 로그인, 결제, 개인정보 처리에 사실상 필수

## HTTPS가 제공하는 것

- 기밀성: 내용을 암호화
- 무결성: 변조 탐지
- 인증: 서버 신원 확인

## 면접 포인트

- HTTPS는 단순히 "보안 버전 HTTP"가 아니라 TLS를 덧씌운 프로토콜이라고 설명하는 것이 좋습니다.
