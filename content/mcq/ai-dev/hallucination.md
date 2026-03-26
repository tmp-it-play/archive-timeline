---
id: "ai-mcq-012"
title: "LLM 할루시네이션(Hallucination)을 줄이는 방법으로 가장 효과적인 것은?"
difficulty: "junior"
category: "ai_dev"
type: "mcq"
options:
  - text: "RAG로 외부 사실 기반 문서를 컨텍스트에 주입한다."
    correct: true
  - text: "Temperature를 1.5 이상으로 높여 창의성을 극대화한다."
    correct: false
  - text: "컨텍스트 윈도우를 최대한 비워둔다."
    correct: false
  - text: "모델 크기를 줄여 과적합을 방지한다."
    correct: false
---

할루시네이션은 LLM이 사실이 아닌 내용을 자신 있게 생성하는 현상입니다.

주요 대응 방법:
- **RAG**: 실제 문서를 컨텍스트로 주입해 근거 있는 응답 유도
- **낮은 Temperature**: 결정론적 출력으로 무작위 생성 최소화
- **"모르면 모른다고 답하라"** 프롬프트 명시
- **검증 단계 추가**: 다른 에이전트나 도구로 답변 교차 검증

Temperature를 높이면 오히려 창의적이지만 **부정확한** 출력이 더 많아집니다.
