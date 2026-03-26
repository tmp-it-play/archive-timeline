---
id: "db-con-011"
title: "N+1 문제란 무엇인가"
difficulty: "mid"
category: "db"
type: "concept"
---

## N+1 문제

한 번의 조회로 끝날 수 있는 작업이,
연관 엔티티를 지연 로딩하면서 추가 쿼리가 반복 발생하는 문제입니다.

예:
- 목록 1번 조회
- 각 원소마다 연관 데이터 조회 N번

## 왜 문제인가?

- 쿼리 수 증가
- 응답 지연
- DB 부하 증가

## 흔한 해결 방향

- fetch join
- batch fetch
- projection/DTO 조회

## 면접 포인트

- ORM과 연관 로딩 전략을 연결해서 설명하면 좋습니다.
