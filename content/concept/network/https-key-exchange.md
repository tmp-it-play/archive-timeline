---
id: "net-con-005"
title: "HTTPS에서 ECDHE와 RSA를 어떻게 이해할까"
difficulty: "senior"
category: "network"
type: "concept"
---

## HTTPS의 암호화 구성

HTTPS는 보통 다음 세 요소를 함께 생각합니다.

- 인증서 기반 서버 인증
- 키 교환
- 대칭키 기반 실제 데이터 암호화

## RSA 기반 키 교환 관점

RSA는 큰 수의 소인수분해 난이도에 기반한 공개키 암호 방식입니다.
과거 TLS에서는 RSA를 이용해 pre-master secret을 안전하게 전달하는 방식이 널리 쓰였습니다.

## ECDHE란?

ECDHE(Elliptic Curve Diffie-Hellman Ephemeral)는 타원 곡선 기반의 일회성 키 교환 방식입니다.

핵심 장점:
- Forward Secrecy 제공
- 장기 개인키가 유출되어도 과거 세션 복호화 위험을 줄일 수 있음

## 왜 ECDHE를 더 선호하나?

- 현대 TLS에서는 Forward Secrecy가 매우 중요함
- 성능과 보안 측면에서 균형이 좋음

## 세션 키 블록에 대해 설명할 때

정확한 버전별 세부는 다를 수 있지만, 보통 다음처럼 설명하면 됩니다.

- client random
- server random
- pre-master secret 또는 key schedule 입력값
- 여기서 파생된 대칭키, MAC 키, IV 등

## 면접 포인트

- RSA와 ECDHE를 "어떤 수학"과 "왜 현대엔 ECDHE를 더 선호하는가"로 연결해 설명하면 좋습니다.
