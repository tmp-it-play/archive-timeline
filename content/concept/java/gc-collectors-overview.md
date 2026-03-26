---
id: "java-con-081"
title: "대표적인 GC 수집기들을 어떻게 볼까"
difficulty: "senior"
category: "java"
type: "concept"
---

## 대표 수집기

- Serial GC
- Parallel GC
- G1 GC
- ZGC
- Shenandoah

## 큰 관점

- 단순성
- 처리량
- 짧은 pause time

이 셋 사이의 트레이드오프로 이해하면 좋습니다.

## 예시

- Parallel GC: 처리량 중심
- G1 GC: 일반적인 서버 환경에서 균형
- ZGC/Shenandoah: 매우 짧은 pause time 지향

## 면접 포인트

- 어떤 GC가 "무조건 최고"라기보다, 서비스의 지연 시간 요구와 힙 크기에 따라 선택이 달라진다고 설명하면 좋습니다.
