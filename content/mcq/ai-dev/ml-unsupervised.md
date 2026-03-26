---
id: "ai-mcq-029"
title: "비지도 학습(Unsupervised Learning)의 특징으로 옳은 것은?"
difficulty: "junior"
category: "ai_dev"
type: "mcq"
options:
  - text: "정답 레이블 없이 데이터 자체의 패턴·구조를 찾아낸다."
    correct: true
  - text: "반드시 보상(Reward) 신호가 필요하다."
    correct: false
  - text: "입력과 정답 쌍이 있어야 학습이 가능하다."
    correct: false
  - text: "GPU 없이는 학습이 불가능하다."
    correct: false
---

비지도 학습은 **정답(Y)이 없는** 데이터에서 패턴을 발견합니다.

백엔드 활용 사례:
- **클러스터링**: 사용자 구매 패턴으로 세그먼트 자동 분류
- **이상 탐지**: 정상 서버 메트릭 패턴을 학습 → 비정상 요청(DDoS 등) 자동 감지
- **임베딩**: 텍스트를 벡터로 변환해 RAG의 Vector DB에 저장

보상 신호 필요 → **강화 학습**, 입력·정답 쌍 필요 → **지도 학습**
