---
id: "java-con-014"
title: "Java 비동기 처리와 checked/unchecked exception"
difficulty: "mid"
category: "java"
type: "concept"
---

## Java 비동기 처리 방법

- `Thread`
- `ExecutorService`
- `CompletableFuture`
- Spring의 `@Async`
- 리액티브 프로그래밍(WebFlux 등)

## checked exception

- 컴파일 시점에 처리 강제
- `Exception` 계열 중 대표적
- `try-catch` 또는 `throws` 필요

## unchecked exception

- 런타임 예외
- `RuntimeException` 계열
- 컴파일 시 강제되지 않음

## 면접 포인트

- 비동기 처리 수단과 예외 체계는 별개지만, 실무에서는 비동기 경계에서 예외 전파 방식이 중요하다고 연결해서 설명할 수 있습니다.
