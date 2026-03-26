---
id: "db-con-028"
title: "HikariCP 튜닝을 어떻게 생각할까"
difficulty: "senior"
category: "db"
type: "concept"
---

## 왜 튜닝이 중요한가?

커넥션 풀이 너무 작으면 대기 시간이 늘고,
너무 크면 DB가 감당해야 할 연결 수가 많아집니다.

## 자주 보는 포인트

### maximumPoolSize
- 너무 크게 잡으면 DB 부하 증가
- 너무 작으면 요청 대기 증가

### connectionTimeout
- 연결을 얼마나 기다릴지

### maxLifetime
- DB 서버 타임아웃보다 너무 길거나 짧지 않게 조정 필요

## 면접 포인트

- 커넥션 풀은 애플리케이션만이 아니라 DB 서버 자원과 함께 봐야 한다고 설명하면 좋습니다.
