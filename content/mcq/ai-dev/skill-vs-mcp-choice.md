---
id: "ai-mcq-021"
title: "Claude Code에서 Skill보다 MCP를 선택해야 하는 상황은?"
difficulty: "mid"
category: "ai_dev"
type: "mcq"
options:
  - text: "실시간으로 PostgreSQL에서 슬로우 쿼리를 조회해 분석해야 할 때"
    correct: true
  - text: "코드 리뷰 시 항상 동일한 관점(보안·성능·가독성)과 출력 형식을 적용하고 싶을 때"
    correct: false
  - text: "Claude에게 특정 페르소나(시니어 백엔드 개발자)를 부여하고 싶을 때"
    correct: false
  - text: "커밋 메시지 작성 지시문을 재사용하고 싶을 때"
    correct: false
---

**MCP**는 외부 시스템과 실제로 읽기·쓰기·API 호출이 필요할 때 사용합니다.
**Skill**은 반복적인 프롬프트 지시문·페르소나·출력 형식을 재사용할 때 사용합니다.

- DB 조회 → 실제 외부 프로세스 실행 필요 → **MCP**
- 코드 리뷰 형식 재사용 → 프롬프트 템플릿으로 충분 → **Skill**
- 페르소나 부여 → 프롬프트 템플릿으로 충분 → **Skill**
- 커밋 메시지 형식 → 프롬프트 템플릿으로 충분 → **Skill**
