---
id: "ai-mcq-007"
title: "RAG(Retrieval-Augmented Generation) 파이프라인의 올바른 순서는?"
difficulty: "mid"
category: "ai_dev"
type: "mcq"
options:
  - text: "질문 임베딩 → 벡터 DB 유사도 검색 → 관련 문서 컨텍스트 주입 → LLM 생성"
    correct: true
  - text: "LLM 생성 → 벡터 DB 유사도 검색 → 질문 임베딩 → 컨텍스트 주입"
    correct: false
  - text: "벡터 DB 유사도 검색 → 질문 임베딩 → LLM 생성 → 컨텍스트 주입"
    correct: false
  - text: "관련 문서 컨텍스트 주입 → 질문 임베딩 → 벡터 DB 검색 → LLM 생성"
    correct: false
---

RAG의 온라인 추론 단계 순서입니다.

1. 사용자 질문을 **임베딩 모델로 벡터화**
2. 벡터 DB에서 **코사인 유사도(또는 내적) 기반 Top-K 검색**
3. 검색된 문서 청크를 **프롬프트에 컨텍스트로 주입**
4. LLM이 컨텍스트를 바탕으로 **최종 답변 생성**

오프라인 인덱싱(문서 청킹 → 임베딩 → DB 저장)은 사전에 수행됩니다.
