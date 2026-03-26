---
id: "net-mcq-004"
title: "TCP 연결 종료가 보통 4-way handshake인 이유로 가장 적절한 것은?"
difficulty: "mid"
category: "network"
type: "mcq"
options:
  - text: "양방향 연결이 독립적으로 종료되므로 ACK와 FIN이 각각 분리되어 전송될 수 있기 때문이다."
    correct: true
  - text: "TCP는 종료 시 반드시 4개의 서버를 거쳐야 하기 때문이다."
    correct: false
  - text: "연결 종료에서는 SYN 패킷을 두 번 더 보내야 하기 때문이다."
    correct: false
  - text: "보안을 위해 종료 패킷을 4번으로 고정한 것이기 때문이다."
    correct: false
---

TCP는 full-duplex 연결이므로 각 방향의 종료가 독립적입니다.
그래서 연결 수립의 3-way handshake와 달리, 연결 종료는 ACK와 FIN 흐름이 분리되어 4단계로 보이는 경우가 일반적입니다.
