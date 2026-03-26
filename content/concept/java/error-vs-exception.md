---
id: "java-con-078"
title: "Error와 Exception의 차이"
difficulty: "junior"
category: "java"
type: "concept"
---

## Error

애플리케이션이 일반적으로 복구하기 어려운 심각한 문제를 나타냅니다.

예:
- `OutOfMemoryError`
- `StackOverflowError`

## Exception

애플리케이션 로직에서 처리하거나 전파할 수 있는 예외 상황입니다.

예:
- `IOException`
- `SQLException`
- `RuntimeException`

## 핵심 차이

- Error: 시스템 수준의 심각한 문제
- Exception: 애플리케이션이 다룰 수 있는 예외 상황

## 면접 포인트

- 둘 다 `Throwable` 아래에 있지만, 실무에서 다루는 태도는 크게 다르다고 설명하면 좋습니다.
