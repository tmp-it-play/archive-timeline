---
id: "db-con-020"
title: "MVCC를 왜 사용할까"
difficulty: "senior"
category: "db"
type: "concept"
---

## MVCC란?

Multi-Version Concurrency Control.
여러 버전의 데이터를 활용해 읽기와 쓰기 충돌을 줄이는 동시성 제어 방식입니다.

## 왜 필요한가?

동시에 트랜잭션이 많이 실행될 때, 단순 잠금만으로 처리하면 병목이 커질 수 있습니다.

## 핵심 아이디어

- 쓰기가 일어날 때 이전 버전을 보존
- 읽는 쪽은 자신에게 보이는 시점의 버전을 읽음

## 면접 포인트

- MVCC는 락을 아예 없애는 기술이 아니라, 읽기-쓰기 충돌을 줄이기 위한 전략이라고 설명하면 좋습니다.
