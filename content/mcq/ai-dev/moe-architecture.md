---
id: "ai-mcq-017"
title: "MoE(Mixture of Experts) 아키텍처에서 GLM-5(744B/40B)의 '40B'가 의미하는 것은?"
difficulty: "senior"
category: "ai_dev"
type: "mcq"
options:
  - text: "추론 시 실제로 활성화되는 파라미터 수로, 나머지 파라미터는 비활성화 상태다."
    correct: true
  - text: "학습에 사용한 데이터 토큰 수(40B 토큰)를 의미한다."
    correct: false
  - text: "모델의 레이어(Layer) 수가 40개임을 의미한다."
    correct: false
  - text: "초당 처리 가능한 토큰 수(40B tokens/s)를 의미한다."
    correct: false
---

MoE(Mixture of Experts)는 **전체 파라미터 중 각 토큰 처리에 일부 전문가(Expert)만 활성화**하는 아키텍처입니다.

- **GLM-5**: 전체 744B 파라미터, 추론 시 40B만 활성
- **Kimi K2.5**: 전체 1T 파라미터, 추론 시 32B만 활성
- **MiniMax M2.7**: 활성 10B (초경량)

이 구조 덕분에 Dense 모델 대비 낮은 추론 비용으로 높은 성능을 달성합니다.
