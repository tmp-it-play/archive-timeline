---
id: "java-con-080"
title: "GC의 Stop-The-World와 튜닝 관점"
difficulty: "senior"
category: "java"
type: "concept"
---

## Stop-The-World란?

GC의 일부 단계에서 애플리케이션 스레드가 잠시 멈추는 현상입니다.

## 왜 중요한가?

- 응답 지연 증가
- 실시간성 요구가 높은 서비스에서 문제 가능

## 무엇을 보나?

- GC pause time
- 객체 생성량
- 힙 크기
- 수집기 종류

## 튜닝 관점

- 메모리를 크게만 주는 것이 정답은 아님
- 객체 생성 패턴, pause time 목표, 서비스 특성을 함께 봐야 함

## 면접 포인트

- GC 튜닝은 단순히 "메모리 더 주기"가 아니라, 지연 시간과 처리량의 균형 문제라고 설명하면 좋습니다.
