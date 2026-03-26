---
id: "db-con-023"
title: "다중 DB 환경에서 무엇을 고민해야 할까"
difficulty: "senior"
category: "db"
type: "concept"
---

## 왜 다중 DB를 쓰나?

- 읽기/쓰기 분리
- 서비스별 DB 분리
- 기능별 스토리지 최적화

## 고민 포인트

- 트랜잭션 경계
- 데이터 정합성
- 장애 전파
- 마이그레이션 전략
- 운영 복잡도

## 예시

- RDB + Redis
- RDB + Elasticsearch
- Primary + Replica

## 면접 포인트

- 다중 DB는 성능과 유연성을 주지만, 정합성과 운영 복잡도가 크게 증가한다고 말하면 좋습니다.
