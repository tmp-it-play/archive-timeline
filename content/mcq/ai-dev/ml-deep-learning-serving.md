---
id: "ai-mcq-031"
title: "백엔드 개발자가 딥러닝 모델을 서비스에 연동할 때 주로 담당하는 영역은?"
difficulty: "mid"
category: "ai_dev"
type: "mcq"
options:
  - text: "학습된 모델을 REST API로 서빙하고 추론 지연시간·캐싱·배치 처리를 최적화한다."
    correct: true
  - text: "GPU 클러스터에서 신경망 레이어를 설계하고 학습 손실 함수를 튜닝한다."
    correct: false
  - text: "데이터 라벨링 작업을 수행하고 학습 데이터셋의 품질을 관리한다."
    correct: false
  - text: "모델의 파라미터 수와 레이어 깊이를 결정하는 아키텍처를 설계한다."
    correct: false
---

딥러닝 프로젝트에서 역할은 크게 나뉩니다.

- **AI/ML 팀**: 모델 아키텍처 설계, 학습(Training), 하이퍼파라미터 튜닝 → GPU 클러스터
- **백엔드 팀**: 학습 완료된 모델을 **추론(Inference) API로 서빙** → 지연시간·처리량 최적화

백엔드 개발자의 관심사:
- 모델 서버 선택 (TorchServe, Triton Inference Server, BentoML)
- 또는 외부 API 연동 (OpenAI, Anthropic, Google)
- 추론 결과 캐싱 (동일 입력 재계산 방지)
- 배치 처리 (여러 요청 묶어서 한 번에 추론)
- 모델 로딩 비용 관리 (콜드 스타트 문제)
