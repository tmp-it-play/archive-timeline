---
id: "net-con-001"
title: "TCP vs UDP"
difficulty: "junior"
category: "network"
type: "concept"
---

## TCP (Transmission Control Protocol)

연결 지향적 프로토콜로 **신뢰성**을 보장합니다.

| 특성 | TCP | UDP |
|------|-----|-----|
| 연결 방식 | 연결 지향 (3-way handshake) | 비연결 지향 |
| 신뢰성 | 보장 (재전송, 순서 보장) | 미보장 |
| 속도 | 상대적으로 느림 | 빠름 |
| 오버헤드 | 높음 | 낮음 |
| 용도 | HTTP, FTP, 이메일 | DNS, 스트리밍, 게임 |

### TCP 특징
- **흐름 제어**: 슬라이딩 윈도우로 수신 측 버퍼 오버플로 방지
- **혼잡 제어**: 네트워크 혼잡 시 전송 속도 조절
- **순서 보장**: SEQ 번호로 패킷 순서 재조립

### UDP 특징
- 헤더가 단순하여 오버헤드 최소 (8바이트 vs TCP 20바이트)
- 브로드캐스트, 멀티캐스트 지원
- 실시간 스트리밍, 온라인 게임, DNS 조회에 사용
