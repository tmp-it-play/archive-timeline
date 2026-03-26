---
id: "net-mcq-003"
title: "HTTPS 연결 수립 과정에 대한 설명으로 가장 올바른 것은?"
difficulty: "mid"
category: "network"
type: "mcq"
options:
  - text: "TLS 핸드셰이크를 통해 인증서 검증과 세션 키 합의가 이뤄진 뒤, 암호화된 HTTP 통신이 시작된다."
    correct: true
  - text: "HTTPS는 TCP 없이 UDP 위에서만 동작하며, 브라우저가 인증서를 검증하지 않는다."
    correct: false
  - text: "HTTPS는 항상 RSA로만 키 교환을 해야 하며 대칭키는 사용하지 않는다."
    correct: false
  - text: "HTTPS는 애플리케이션 데이터까지 평문으로 보내고 헤더만 암호화한다."
    correct: false
---

HTTPS는 보통 TCP 연결 이후 TLS 핸드셰이크를 수행하고, 이 과정에서 서버 인증서 검증과 세션 키 합의가 일어납니다.
그 이후 실제 HTTP 요청과 응답은 대칭키 기반으로 암호화되어 전송됩니다.
