---
id: "db-con-021"
title: "Undo Log는 왜 필요한가"
difficulty: "senior"
category: "db"
type: "concept"
---

## Undo Log란?

트랜잭션 이전 상태를 되돌릴 수 있도록 기록하는 로그입니다.

## 왜 필요한가?

- 롤백
- MVCC에서 이전 버전 조회

## 어디에 연결되나?

특히 MySQL InnoDB를 설명할 때 MVCC와 함께 자주 언급됩니다.

## 면접 포인트

- Undo Log는 단순 복구용이 아니라, 동시성 제어와도 깊게 연결된다고 설명하면 좋습니다.
