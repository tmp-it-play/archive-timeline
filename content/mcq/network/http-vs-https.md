---
id: "net-mcq-002"
title: "HTTP와 HTTPS의 차이점으로 올바른 것은?"
difficulty: "junior"
category: "network"
type: "mcq"
options:
  - text: "HTTPS는 TLS/SSL을 통해 데이터를 암호화한다"
    correct: true
  - text: "HTTPS는 HTTP보다 빠르다"
    correct: false
  - text: "HTTP는 기본 포트 443을 사용한다"
    correct: false
  - text: "HTTPS는 세션 계층에서 동작한다"
    correct: false
---

HTTP(HyperText Transfer Protocol)와 HTTPS의 핵심 차이는 **보안**입니다.

- **HTTP**: 평문 전송, 포트 80
- **HTTPS**: TLS(Transport Layer Security)/SSL(Secure Sockets Layer)로 암호화, 포트 443

HTTPS는 TLS 핸드셰이크로 인해 초기 연결 시 약간의 오버헤드가 있지만, HTTP/2 채택으로 실제 체감 속도는 HTTPS가 더 빠른 경우도 많습니다.

TLS는 **전송 계층(Layer 4)** 위에서 동작하는 별도의 프로토콜입니다.
