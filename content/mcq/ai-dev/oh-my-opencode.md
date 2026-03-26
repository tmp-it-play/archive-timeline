---
id: "ai-mcq-015"
title: "Oh My OpenCode의 Sisyphus 오케스트레이션 시스템의 역할은?"
difficulty: "mid"
category: "ai_dev"
type: "mcq"
options:
  - text: "여러 전문 에이전트에게 작업을 분배하고 병렬 백그라운드 실행을 조율한다."
    correct: true
  - text: "코드 자동완성 속도를 높이기 위한 캐싱 레이어다."
    correct: false
  - text: "OpenCode의 터미널 UI를 웹 브라우저에서 열어주는 기능이다."
    correct: false
  - text: "LLM API 요청을 로드밸런싱하는 프록시 서버다."
    correct: false
---

Oh My OpenCode는 OpenCode를 멀티 에이전트 시스템으로 확장하는 커뮤니티 플러그인입니다.
**Sisyphus**는 핵심 오케스트레이션 엔진으로, 사용자의 요청을 11개의 전문 에이전트(Engineering, Review, Testing, Docs 등)에게 분배해 **병렬로 실행**합니다.
각 에이전트는 역할에 최적화된 모델(Claude, GPT, Gemini, Minimax 등)과 프롬프트를 사용합니다.
