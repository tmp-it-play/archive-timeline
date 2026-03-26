---
id: "java-con-002"
title: "Kotlin 람다식 기본 사용법"
difficulty: "junior"
category: "java"
type: "concept"
---

## Kotlin 람다식이란?

람다식은 이름 없는 함수를 값처럼 다루는 문법입니다.
Kotlin에서는 컬렉션 처리, 고차 함수, DSL 스타일 코드에서 자주 사용됩니다.

## 기본 형태

```kotlin
val sum = { a: Int, b: Int -> a + b }
println(sum(1, 2))
```

- `{ }` 안에 작성
- `->` 왼쪽은 파라미터, 오른쪽은 실행식

## 고차 함수와 함께 사용

```kotlin
val numbers = listOf(1, 2, 3, 4)
val evenNumbers = numbers.filter { it % 2 == 0 }
println(evenNumbers)
```

- `filter`는 함수를 인자로 받는 고차 함수
- 파라미터가 하나면 `it`을 생략형으로 사용 가능

## 마지막 인자가 람다일 때

Kotlin은 마지막 인자가 람다이면 괄호 밖으로 뺄 수 있습니다.

```kotlin
numbers.forEach { println(it) }
```

## 명시적으로 타입 쓰기

```kotlin
val greet: (String) -> String = { name -> "Hello, $name" }
```

## 면접 포인트

- 람다 자체 문법만 말하지 말고 `filter`, `map`, `forEach` 예시를 함께 드는 것이 좋습니다.
- Kotlin 람다는 함수형 프로그래밍과 고차 함수 지원의 핵심 문법이라고 설명할 수 있어야 합니다.
