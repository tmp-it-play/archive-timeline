---
id: "db-con-002"
title: "RDB와 NoSQL의 차이, 그리고 MongoDB 트랜잭션"
difficulty: "mid"
category: "db"
type: "concept"
---

## RDB와 NoSQL의 큰 차이

### RDB
- 테이블, 스키마, 관계 중심
- JOIN과 정규화에 강함
- 트랜잭션과 일관성 보장이 중요한 업무 시스템에 적합

### NoSQL
- 문서, 키-값, 컬럼, 그래프 등 다양한 모델
- 유연한 스키마
- 대규모 확장, 빠른 개발, 특정 접근 패턴 최적화에 강함

## 대표적인 NoSQL DB

- MongoDB: 문서 지향
- Redis: 키-값
- Cassandra: wide-column
- HBase: wide-column
- Neo4j: 그래프

## MongoDB 트랜잭션

MongoDB는 과거엔 단일 도큐먼트 원자성이 핵심이었지만, 현재는 **멀티 도큐먼트 트랜잭션**도 지원합니다.

보통:
- replica set 또는 sharded cluster 환경
- session 기반으로 시작
- `startTransaction`, `commitTransaction`, `abortTransaction` 흐름

## MongoDB는 ACID를 지키는가?

트랜잭션 범위 안에서는 ACID 특성을 제공한다고 볼 수 있습니다.
다만 관계형 DB처럼 모든 설계가 트랜잭션 중심인 것은 아니고, MongoDB는 여전히 "도큐먼트 단위 모델링"을 우선 권장합니다.

즉, "트랜잭션도 가능하지만, 남용하기보단 문서 모델링으로 해결하는 것이 기본"이라고 이해하는 편이 좋습니다.

## 면접 포인트

- RDB는 관계/정합성, NoSQL은 확장성과 유연성이 강점입니다.
- MongoDB도 트랜잭션이 가능하지만, 관계형 DB와 완전히 같은 사고방식으로 쓰는 것은 아닙니다.
