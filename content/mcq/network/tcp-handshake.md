---
id: "net-mcq-001"
title: "TCP 3-way handshake의 올바른 순서는?"
difficulty: "junior"
category: "network"
type: "mcq"
options:
  - text: "SYN → SYN-ACK → ACK"
    correct: true
  - text: "ACK → SYN → FIN"
    correct: false
  - text: "FIN → FIN-ACK → RST"
    correct: false
  - text: "SYN → ACK → FIN"
    correct: false
---

TCP 3-way handshake는 TCP 연결 수립 과정입니다.

1. **SYN**: 클라이언트가 서버에 연결 요청 (Synchronize)
2. **SYN-ACK**: 서버가 요청을 수락하고 응답 (Synchronize-Acknowledge)
3. **ACK**: 클라이언트가 최종 확인 (Acknowledge)

이 과정을 통해 양방향 통신이 가능한 신뢰성 있는 연결이 수립됩니다.
