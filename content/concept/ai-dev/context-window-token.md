---
id: "ai-con-002"
title: "Context Window & Token"
difficulty: "junior"
category: "ai_dev"
type: "concept"
---

## Token이란?

LLM이 텍스트를 처리하는 **최소 단위**입니다. 단어 전체가 아닌 의미 단위로 분리됩니다.

### 토크나이징 예시 (BPE 기반)

```
"Hello, world!"  →  ["Hello", ",", " world", "!"]   → 4 tokens
"안녕하세요"      →  ["안녕", "하", "세요"]           → 3 tokens (한국어는 영어보다 토큰 효율이 낮음)
```

### 토큰 비율 (대략)

| 언어 | 평균 비율 |
|------|---------|
| 영어 | 1 token ≈ 4 문자 |
| 한국어 | 1 token ≈ 1.5~2 문자 |
| 코드 | 1 token ≈ 3~4 문자 |

## Context Window란?

모델이 **한 번의 추론에서 처리할 수 있는 최대 토큰 수**입니다. 입력(프롬프트 + 대화 이력)과 출력을 합산합니다.

### 주요 모델 컨텍스트 크기 (2025 기준)

| 모델 | Context Window |
|------|---------------|
| GPT-4o | 128K tokens |
| Claude Sonnet 4.x | 200K tokens |
| Gemini 1.5 Pro | 1M tokens |
| Gemini 2.5 Pro | 1M+ tokens |

## 컨텍스트 초과 시 발생하는 문제

1. **잘림(Truncation)**: 오래된 대화 내용이 자동으로 잘려 "기억 손실" 발생
2. **품질 저하**: 컨텍스트가 꽉 찰수록 모델 집중도 분산 (Lost in the Middle 현상)
3. **비용 증가**: 토큰 수 = 비용이므로 불필요한 컨텍스트는 제거

## 에이전트 개발에서의 중요성

AI 에이전트가 코드베이스를 탐색하거나 긴 파일을 처리할 때 컨텍스트 관리가 핵심입니다.

```
코드베이스 전체 → 요약(Summarization) → 핵심만 컨텍스트 주입
                → RAG(검색) → 관련 청크만 주입
```

## 비용 최적화 전략

- **Prompt Caching**: 반복되는 시스템 프롬프트 캐시 활용 (Claude, GPT-4o 지원)
- **Chunking**: 긴 문서를 분할해 필요한 부분만 처리
- **Summarization**: 이전 대화를 요약해 컨텍스트 압축
