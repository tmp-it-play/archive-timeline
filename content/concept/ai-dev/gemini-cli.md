---
id: "ai-con-009"
title: "Gemini CLI"
difficulty: "junior"
category: "ai_dev"
type: "concept"
---

## Gemini CLI란?

Google이 2025년 6월 공개한 **터미널 기반 AI 코딩 어시스턴트**입니다. Gemini 2.5 Pro 모델을 활용하며 오픈소스로 제공됩니다.

## 핵심 특징

| 항목 | 내용 |
|------|------|
| 기반 모델 | Gemini 2.5 Pro |
| 컨텍스트 | 최대 1M 토큰 (대규모 코드베이스 처리 가능) |
| 무료 티어 | 개인 Google 계정으로 무료 사용 가능 |
| 라이선스 | Apache 2.0 (오픈소스) |
| 설치 | `npm install -g @google/gemini-cli` |

## 주요 기능

- **파일 탐색·편집**: 코드베이스 읽기, 파일 수정·생성
- **터미널 명령 실행**: 쉘 명령 직접 실행
- **웹 검색**: Google 검색 통합
- **MCP 지원**: MCP 서버 연결로 기능 확장
- **멀티모달**: 이미지·스크린샷 분석

## Claude Code와 비교

| 항목 | Gemini CLI | Claude Code |
|------|-----------|-------------|
| 제공사 | Google | Anthropic |
| 기반 모델 | Gemini 2.5 Pro | Claude Sonnet/Opus |
| 컨텍스트 | 1M 토큰 | 200K 토큰 |
| 무료 티어 | 있음 (개인 계정) | 유료 (API Key 필요) |
| 오픈소스 | O | X |
| MCP 지원 | O | O |

## 사용 예시

```bash
# 설치
npm install -g @google/gemini-cli

# 실행
gemini

# 비대화 모드 (파이프라인)
gemini -p "이 코드의 버그를 찾아줘" < main.py
```

## 1M 컨텍스트의 의미

대부분의 실제 프로젝트 코드베이스 전체를 한 번에 컨텍스트에 넣을 수 있습니다. 이로 인해 별도의 RAG 없이도 전체 코드베이스 이해가 가능합니다.
