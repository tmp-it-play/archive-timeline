---
id: "net-mcq-005"
title: "HTTPS 키 교환에서 ECDHE를 선호하는 이유로 가장 적절한 것은?"
difficulty: "senior"
category: "network"
type: "mcq"
options:
  - text: "Forward Secrecy를 제공해 장기 개인키가 유출되어도 과거 세션 보호에 유리하기 때문이다."
    correct: true
  - text: "RSA는 수학적으로 암호화가 불가능하기 때문이다."
    correct: false
  - text: "ECDHE는 대칭키 암호라서 인증서가 필요 없기 때문이다."
    correct: false
  - text: "ECDHE는 TCP 없이도 항상 동작하기 때문이다."
    correct: false
---

ECDHE는 일회성 키 합의를 통해 Forward Secrecy를 제공할 수 있어 현대 TLS에서 널리 선호됩니다.
