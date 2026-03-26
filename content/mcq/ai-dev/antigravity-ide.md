---
id: "ai-mcq-019"
title: "Google Antigravity의 Manager View가 Editor View와 구별되는 핵심 기능은?"
difficulty: "junior"
category: "ai_dev"
type: "mcq"
options:
  - text: "여러 AI 에이전트를 병렬로 실행하고 Artifacts로 진행 상황을 시각적으로 감독한다."
    correct: true
  - text: "Gemini 모델만 사용하도록 강제하고 타사 모델 연결을 차단한다."
    correct: false
  - text: "코드 인라인 자동완성과 탭 완성을 제공하는 동기적 편집 환경이다."
    correct: false
  - text: "웹 브라우저 기반으로 실행되어 로컬 파일 시스템 접근이 불가능하다."
    correct: false
---

Google Antigravity는 두 가지 뷰를 제공합니다.
- **Editor View**: 일반 IDE처럼 동기적으로 코드를 작성하는 공간
- **Manager View**: 여러 에이전트가 **비동기·병렬로** 작업하는 컨트롤 센터

**Artifacts**는 에이전트가 만드는 작업 목록, 구현 계획, 브라우저 녹화본 등 가시적인 결과물로, 에이전트의 작업을 투명하게 검증할 수 있게 합니다.
Claude Sonnet/Opus 4.6, GPT-OSS-120B 등 타사 모델도 지원합니다.
