---
id: "os-con-011"
title: "Mutex와 Semaphore의 차이"
difficulty: "mid"
category: "os"
type: "concept"
---

## Mutex

상호 배제를 위한 잠금입니다.
보통 한 번에 하나의 스레드만 임계 구역에 들어가게 합니다.

## Semaphore

허용 가능한 자원 개수를 카운트로 관리하는 동기화 도구입니다.

## 차이

- Mutex: 1개 소유 개념
- Semaphore: N개 자원 관리 가능

## 면접 포인트

- 둘 다 동기화 도구지만, 목적과 표현 방식이 다르다고 설명하면 좋습니다.
