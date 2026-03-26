---
id: "ai-mcq-001"
title: "MCP(Model Context Protocol)에서 Tools 프리미티브의 역할은?"
difficulty: "mid"
category: "ai_dev"
type: "mcq"
options:
  - text: "AI 모델이 외부 시스템에 액션을 수행할 수 있도록 호출 가능한 함수를 노출한다."
    correct: true
  - text: "읽기 전용 데이터(파일, DB 레코드 등)를 모델에게 노출한다."
    correct: false
  - text: "재사용 가능한 프롬프트 템플릿을 정의한다."
    correct: false
  - text: "MCP 서버와 클라이언트 간 인증을 담당한다."
    correct: false
---

MCP의 3가지 프리미티브는 **Resources**(읽기 전용 데이터), **Tools**(실행 가능한 함수·액션), **Prompts**(재사용 가능한 프롬프트 템플릿)입니다.
Tools는 파일 쓰기, DB 쿼리, 외부 API 호출처럼 **부수 효과(side effect)가 있는 작업**에 사용됩니다.
