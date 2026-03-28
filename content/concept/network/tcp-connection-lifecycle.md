---
id: "net-con-006"
title: "TCP 3-way handshake와 4-way handshake"
difficulty: "junior"
category: "network"
type: "concept"
---

## 3-way handshake

TCP 연결 수립 과정입니다.

1. 클라이언트가 SYN 전송
2. 서버가 SYN-ACK 응답
3. 클라이언트가 ACK 응답

이 과정을 통해 양쪽이 송수신 가능 상태를 확인합니다.

## 4-way handshake

TCP 연결 종료 과정입니다.

1. 한쪽이 FIN 전송
2. 상대가 ACK 응답
3. 상대도 FIN 전송
4. 처음 종료 요청한 쪽이 ACK 응답

## 왜 종료는 4단계인가?

TCP는 양방향 연결이므로, 한 방향의 종료와 반대 방향의 종료가 독립적입니다.
그래서 수립보다 종료가 더 길게 보입니다.

## 면접 포인트

- 연결 수립과 종료 모두 "양쪽 상태를 확인하는 과정"이라는 큰 그림으로 설명하면 좋습니다.
