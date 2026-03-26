---
id: "cloud-con-009"
title: "Docker를 왜 쓰고, 대량 트래픽은 어떻게 처리할까"
difficulty: "junior"
category: "cloud_devops"
type: "concept"
---

## Docker란?

애플리케이션과 실행 환경을 컨테이너 이미지로 묶어 일관되게 실행하는 기술입니다.

## 왜 쓰나?

- 개발/운영 환경 차이 감소
- 배포 단위 표준화
- 빠른 실행과 롤백

## 대량 트래픽 처리 기본 방향

- scale up: 더 큰 서버
- scale out: 서버 대수 증가

## 왜 클라우드에선 scale out이 흔한가?

- 인스턴스 증설/축소가 쉬움
- 로드 밸런서를 붙이기 좋음
- 장애 격리와 가용성 확보에 유리함

## Stateless 서버가 중요한 이유

- 요청을 어느 서버로 보내도 처리 가능해야 scale out이 쉬움
- 상태는 DB, Redis, 세션 저장소 같은 외부로 분리하는 편이 유리함

## 면접 포인트

- Docker는 배포/실행 환경 일관성
- scale out은 확장성과 가용성 관점으로 설명하면 좋습니다.
