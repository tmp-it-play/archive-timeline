---
id: "db-con-027"
title: "HikariCP를 왜 많이 사용할까"
difficulty: "mid"
category: "db"
type: "concept"
---

## HikariCP란?

Java에서 널리 쓰이는 고성능 JDBC 커넥션 풀 구현체입니다.

## 왜 많이 쓰나?

- 빠른 성능
- 안정성
- 설정과 운영 경험이 풍부함

## 어떤 문제를 해결하나?

매 요청마다 DB 연결을 새로 만드는 비용을 줄이고,
미리 만들어 둔 연결을 재사용할 수 있게 합니다.

## 자주 보는 설정

- maximumPoolSize
- minimumIdle
- connectionTimeout
- idleTimeout
- maxLifetime

## 면접 포인트

- HikariCP는 단순 라이브러리가 아니라, DB 연결 자원 관리 전략의 핵심 구성 요소라고 설명하면 좋습니다.
