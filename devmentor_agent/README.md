# DevMentor Agent

## 서비스 개요

**DevMentor Agent**는 풀스택 개발자를 위한 종합 멘토링 AI 에이전트입니다. ACE Agent 아키텍처를 참고하여 개발된 이 시스템은 개발자의 학습 및 성장을 체계적으로 지원합니다.

### 지원 기술 스택
- **프로그래밍 언어**: Java, Kotlin, Python, JavaScript, TypeScript, C, Lua, HCL, Go, Dart, SQL
- **프레임워크/라이브러리**: SpringBoot, Flask, FastAPI, NestJS, React, Flutter
- **이론 분야**: RDB 기초, NoSQL(Redis, MongoDB), 네트워크 기초, 브라우저 렌더링, AWS 인프라, Terraform

## 서비스 목적

1. **개인화된 학습 로드맵 제공**
   - 현재 개발자의 실력 수준 평가
   - 목표 기반 단계별 학습 계획 수립
   - 기술 트렌드를 반영한 커리어 가이드

2. **실시간 코드 멘토링**
   - 코드 품질 분석 및 개선 제안
   - 에러 디버깅 및 트러블슈팅 지원
   - 베스트 프랙티스 가이드

3. **종합적 기술 상담**
   - 아키텍처 설계 조언
   - 기술 선택 가이드
   - 성능 최적화 방법

## 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)            │
│  - 채팅 인터페이스                                           │
│  - 코드 에디터                                              │
│  - 로드맵 시각화                                            │
└─────────────────────┬───────────────────────────────────────┘
                      │ WebSocket/HTTP API
┌─────────────────────▼───────────────────────────────────────┐
│                Backend (FastAPI + Python)                  │
│                                                             │
│  ┌─ Chat Engine ──────────┐  ┌─ Code Analyzer ──────────┐  │
│  │ - OpenAI GPT-4 통합    │  │ - 코드 파싱 및 분석      │  │
│  │ - 대화 컨텍스트 관리   │  │ - 정적 분석 도구 통합    │  │
│  │ - 멘토링 로직          │  │ - 에러 패턴 매칭        │  │
│  └────────────────────────┘  └─────────────────────────┘  │
│                                                             │
│  ┌─ Knowledge Base ────────┐  ┌─ Session Manager ────────┐  │
│  │ - 로드맵 데이터         │  │ - 사용자 세션 관리       │  │
│  │ - 기술 스택 정보       │  │ - 학습 진도 추적         │  │
│  │ - 베스트 프랙티스      │  │ - 개인화 데이터          │  │
│  └────────────────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 인공지능 에이전트 기술 구현

### 1. Multi-Agent 시스템
- **MentorAgent**: 학습 로드맵 및 커리어 가이드 전담
- **CodeReviewAgent**: 코드 분석 및 품질 개선 전담
- **TroubleshootingAgent**: 에러 해결 및 디버깅 전담

### 2. RAG (Retrieval Augmented Generation)
- 최신 기술 문서 및 베스트 프랙티스 데이터베이스 구축
- 실시간 정보 검색을 통한 정확한 답변 제공

### 3. Context-Aware Conversation
- 사용자의 기술 스택 및 경험 수준 기억
- 대화 히스토리 기반 개인화된 멘토링

## 관련 논문 및 레퍼런스

### 논문
1. **"Large Language Models for Code: A Survey"** (2023)
   - LLM을 활용한 코드 분석 및 생성 기법

2. **"CodeBERT: A Pre-Trained Model for Programming and Natural Languages"** (2020)
   - 코드와 자연어의 결합 모델링

3. **"Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"** (2020)
   - RAG 시스템의 기본 구조 및 활용

### 기술 레퍼런스
- **NVIDIA ACE Agent Architecture**: 마이크로서비스 기반 대화형 AI 시스템
- **OpenAI GPT-4 API**: 대화형 AI 엔진
- **FastAPI**: 고성능 Python 웹 프레임워크
- **React**: 모던 프론트엔드 개발

## 주요 기능

### 1. 학습 로드맵 생성
- 현재 실력 진단 테스트
- 목표 기반 맞춤형 학습 계획
- 단계별 체크포인트 관리

### 2. 코드 분석 및 리뷰
- 다중 언어 코드 파싱
- 코드 품질 메트릭 분석
- 보안 취약점 검사
- 성능 최적화 제안

### 3. 실시간 멘토링 채팅
- 기술 질문 답변
- 문제 해결 가이드
- 아키텍처 설계 조언

### 4. 커리어 가이드
- 기술 트렌드 분석
- 직무별 요구 스킬
- 포트폴리오 개선 제안

## 🛠️ 설치 및 실행

### 백엔드 실행
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 프론트엔드 실행
```bash
cd frontend
npm install
npm start
```

## 성능 지표

- **응답 시간**: 평균 2초 이내
- **지원 언어**: 11개 프로그래밍 언어
- **동시 사용자**: 최대 100명
- **코드 분석 정확도**: 95% 이상

## 기술 스택

- **Backend**: FastAPI, Python 3.9+, OpenAI API
- **Frontend**: React 18, TypeScript, Material-UI
- **Database**: SQLite (개발), PostgreSQL (운영)
- **Deployment**: Docker, Kubernetes
- **Monitoring**: Prometheus, Grafana
