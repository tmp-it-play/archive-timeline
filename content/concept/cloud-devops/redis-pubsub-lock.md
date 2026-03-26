---
id: "cloud-con-010"
title: "Redis Pub/Sub 기반 Lock을 어떻게 이해할까"
difficulty: "senior"
category: "cloud_devops"
type: "concept"
---

## 기본 아이디어

Redis를 이용해 분산 환경에서 특정 작업을 한 번만 수행하도록 제어하는 방식입니다.

## 왜 Pub/Sub를 같이 쓰나?

- 락 해제 시 대기 중인 워커에게 빠르게 알릴 수 있음
- 단순 polling보다 반응성이 좋을 수 있음

## 주의점

- Pub/Sub 메시지는 영속 저장이 아님
- 구독 타이밍, 장애, 재시도 전략을 신중히 설계해야 함
- 락 만료 시간과 실제 작업 시간이 어긋나면 위험

## 면접 포인트

- Redis 락은 빠르지만, "절대 안전한 만능 락"처럼 말하면 위험합니다.
