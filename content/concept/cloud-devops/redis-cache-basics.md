---
id: "cloud-con-008"
title: "Redis를 왜 쓰고, 캐시는 어떻게 운영할까"
difficulty: "mid"
category: "cloud_devops"
type: "concept"
---

## Redis를 쓰는 이유

Redis는 인메모리 기반 저장소로 읽기/쓰기 속도가 매우 빠릅니다.

주요 활용:
- 캐시
- 세션 저장
- 분산 락
- 큐/스트림
- TTL 기반 임시 데이터

## Cache Aside

1. 캐시 조회
2. 없으면 DB 조회
3. 결과를 캐시에 저장

가장 흔한 캐시 패턴입니다.

## TTL 전략

- 너무 길면 오래된 데이터 위험
- 너무 짧으면 캐시 효과 감소
- 데이터 성격에 따라 다르게 설정해야 함

## 캐시 무효화

- 쓰기 시 삭제
- 쓰기 시 갱신
- TTL에 의존

## Redis 장애가 나면?

- 캐시 미스 증가로 DB 부하 상승
- 장애 전파를 막기 위해 fallback, circuit breaker, timeout, local cache 등을 고려할 수 있음

## 면접 포인트

- Redis는 "빠르다"를 넘어 어떤 역할로 쓰는지가 중요합니다.
