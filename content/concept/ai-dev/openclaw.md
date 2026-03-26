---
id: "ai-con-010"
title: "OpenClaw — 자율 AI 에이전트"
difficulty: "junior"
category: "ai_dev"
type: "concept"
---

## OpenClaw이란?

오스트리아 개발자 Peter Steinberger가 만든 **무료 오픈소스 자율 AI 에이전트**입니다. 터미널이나 전용 앱 대신 **메시징 플랫폼(WhatsApp, Telegram, Discord, Slack, iMessage 등)을 UI로 사용**한다는 점이 독특합니다.

## 연혁

| 날짜 | 이벤트 |
|------|--------|
| 2025년 11월 | **Clawdbot**이라는 이름으로 GitHub 공개 |
| 2026년 1월 27일 | Anthropic 상표권 문제로 **Moltbot**으로 변경 |
| 2026년 1월 30일 | 발음 어색함으로 **OpenClaw**로 최종 변경 |
| 2026년 2월 14일 | Steinberger가 OpenAI 합류, 프로젝트를 오픈소스 재단으로 이관 |

## 핵심 특징

- **메시지 기반 인터페이스**: 평소 쓰는 채팅 앱으로 AI에게 작업 지시
- **자율 실행**: 파일 관리, 브라우저 제어, API 호출, 워크플로 자동화
- **자기 개선(Self-improving)**: 새로운 작업을 처리하기 위해 스스로 코드를 작성해 새로운 Skill을 생성
- **장기 메모리**: 사용자 선호와 맥락을 장기 저장
- **크로스 플랫폼**: Mac, Windows, Linux 지원

## 아키텍처 개념

```
사용자 (WhatsApp/Telegram/Discord)
    → OpenClaw 서버 (로컬 또는 클라우드)
        → LLM (다양한 모델 지원)
        → Tool Execution (파일·브라우저·API)
        → Skill 자동 생성 (필요 시)
```

## 자기 개선(Self-improving)의 의미

OpenClaw가 처리하지 못하는 작업을 만나면, **스스로 해당 기능을 구현하는 코드를 작성**해 Skill로 등록합니다. 이후 같은 종류의 작업은 새 Skill을 활용합니다.

## 주목받는 이유

- GitHub 스타 30만 이상 (React, Linux 초과)
- "항상 켜져 있는" AI 에이전트 수요로 중국 Mac Mini 품귀 현상 유발
- 설치형 로컬 실행으로 데이터 주권 확보 가능
