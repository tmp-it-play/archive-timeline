---
id: "cloud-con-016"
title: "Retry와 Circuit Breaker를 왜 함께 생각해야 할까"
difficulty: "senior"
category: "cloud_devops"
type: "concept"
---

## Retry

일시적 실패에 대해 다시 시도하는 전략입니다.

## Circuit Breaker

연속 실패가 많아질 때 호출을 잠시 차단해 시스템 전체 장애 확산을 막는 패턴입니다.

## 왜 같이 중요한가?

Retry만 과도하게 걸면 장애 중인 하위 시스템에 더 큰 부하를 줄 수 있습니다.

## 면접 포인트

- 분산 시스템에서는 "실패를 어떻게 다루는가"가 핵심이라는 관점으로 설명하면 좋습니다.
