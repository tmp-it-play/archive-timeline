---
id: "ai-mcq-028"
title: "백엔드 서비스에서 지도 학습(Supervised Learning)을 적용하기에 가장 적합한 사례는?"
difficulty: "junior"
category: "ai_dev"
type: "mcq"
options:
  - text: "이메일이 스팸인지 아닌지 분류하는 필터 (스팸/정상 라벨링 데이터 보유)"
    correct: true
  - text: "정답 없이 사용자 행동 로그에서 자연스러운 그룹을 찾아내는 세그먼테이션"
    correct: false
  - text: "게임 AI가 승리 보상을 통해 최적의 전략을 스스로 학습"
    correct: false
  - text: "서버 트래픽 로그에서 정상 패턴을 익혀 이상 징후를 탐지"
    correct: false
---

지도 학습은 **입력(X)과 정답(Y) 쌍**으로 학습합니다.
스팸 필터는 (이메일 텍스트 → 스팸/정상) 라벨이 있는 대표적인 지도 학습 분류 문제입니다.

- 정답 없는 그룹 찾기 → **비지도 학습 (클러스터링)**
- 보상으로 전략 학습 → **강화 학습**
- 정상 패턴 학습 후 이탈 탐지 → **비지도 학습 (이상 탐지)**
