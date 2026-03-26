---
id: "cloud-con-004"
title: "BFF 패턴과 API Gateway의 차이"
difficulty: "mid"
category: "cloud_devops"
type: "concept"
---

## BFF란?

BFF(Backend For Frontend)는 특정 프론트엔드에 최적화된 백엔드 계층입니다.

예:
- 웹용 BFF
- 모바일용 BFF
- 관리자 콘솔용 BFF

## 왜 필요한가?

- 여러 백엔드 API를 프론트 요구에 맞게 조합
- 프론트별 응답 형태 최적화
- 인증, 캐싱, 집계 로직을 프론트 대신 처리

## API Gateway와의 차이

### API Gateway
- 라우팅, 인증, rate limiting, 공통 정책
- 인프라/엣지 계층 성격이 강함

### BFF
- 화면/클라이언트 요구에 맞춘 비즈니스 조합 로직
- 애플리케이션 계층 성격이 강함

## 함께 쓸 수 있나?

가능합니다.

- API Gateway: 외부 진입점
- BFF: 프론트 맞춤 조합 서버

## 면접 포인트

- API Gateway와 BFF를 같은 것으로 말하면 아쉬움이 큽니다.
- Gateway는 공통 정책, BFF는 클라이언트 맞춤 조합이라는 차이를 말하는 것이 핵심입니다.
