---
id: "db-con-003"
title: "트랜잭션 격리 수준과 전파"
difficulty: "mid"
category: "db"
type: "concept"
---

## 격리 수준(Isolation Level)

동시에 실행되는 트랜잭션 사이에서 어느 정도까지 서로 영향을 허용할지 정하는 수준입니다.

대표적으로:
- Read Uncommitted
- Read Committed
- Repeatable Read
- Serializable

## 왜 필요한가?

동시성 문제와 성능 사이의 균형을 맞추기 위해서입니다.

## 트랜잭션 전파

이미 트랜잭션이 있는 상태에서 새로운 메서드가 호출될 때,
그 메서드가 기존 트랜잭션에 참여할지 새로 만들지 정하는 정책입니다.

예:
- `REQUIRED`
- `REQUIRES_NEW`
- `MANDATORY`

## 면접 포인트

- 격리 수준은 DB 동시성 관점
- 전파는 애플리케이션 서비스 메서드 호출 관점이라는 점을 구분해야 합니다.
