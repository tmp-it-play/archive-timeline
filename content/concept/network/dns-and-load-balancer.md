---
id: "net-con-011"
title: "DNS 동작 과정과 Load Balancer의 역할"
difficulty: "mid"
category: "network"
type: "concept"
---

## DNS 동작 과정

도메인 이름을 IP 주소로 바꾸는 과정입니다.

보통:
1. 브라우저/OS 캐시 확인
2. 로컬 DNS 서버 질의
3. 루트 -> TLD -> Authoritative DNS 순으로 조회
4. 최종 IP 응답

## Load Balancer의 역할

- 여러 서버로 요청 분산
- 특정 서버 장애 시 우회
- 확장성과 가용성 향상

## 함께 이해하면 좋은 것

- DNS는 "어디로 갈지 찾는 단계"
- Load Balancer는 "찾아간 이후 어디 인스턴스로 보낼지 결정하는 단계"

## 면접 포인트

- DNS와 LB를 한 덩어리로 말하지 말고, 이름 해석과 트래픽 분산의 역할 차이를 설명해야 합니다.
