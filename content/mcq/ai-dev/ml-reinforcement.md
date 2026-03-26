---
id: "ai-mcq-030"
title: "강화 학습(Reinforcement Learning)이 백엔드 서비스에 적용된 사례로 가장 적절한 것은?"
difficulty: "mid"
category: "ai_dev"
type: "mcq"
options:
  - text: "광고 노출 전략을 클릭률 보상 신호로 실시간 최적화하는 추천 시스템"
    correct: true
  - text: "라벨링된 리뷰 데이터로 감정(긍정/부정)을 분류하는 모델"
    correct: false
  - text: "사용자 로그를 정답 없이 군집화해 세그먼트를 도출하는 분석"
    correct: false
  - text: "사전 학습된 GPT-5.4 API를 호출해 텍스트를 요약하는 기능"
    correct: false
---

강화 학습은 **보상(Reward)/패널티 신호**를 받아 시행착오로 최적 행동을 학습합니다.

백엔드 서비스에서의 활용:
- **광고·추천**: 클릭·구매를 보상으로 노출 전략 자동 개선
- **오토스케일링**: 응답속도·비용을 보상 함수로 스케일 정책 최적화
- **LLM RLHF**: 사람 피드백(Human Feedback)을 보상으로 LLM 품질 향상 (ChatGPT, Claude의 학습 방식)

나머지 선택지는 지도 학습(감정 분류), 비지도 학습(군집화), 단순 API 호출입니다.
