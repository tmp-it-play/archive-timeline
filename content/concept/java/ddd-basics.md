---
id: "java-con-058"
title: "DDD 기초: Entity, Value Object, Aggregate"
difficulty: "senior"
category: "java"
type: "concept"
---

## Entity

식별성이 중요한 객체입니다.
같은 속성을 가져도 ID가 다르면 다른 객체로 봅니다.

## Value Object

식별성보다 값 자체가 중요한 객체입니다.
불변으로 설계하는 경우가 많습니다.

## Aggregate

도메인 일관성을 관리하는 경계입니다.
외부에서는 보통 Aggregate Root를 통해서만 접근합니다.

## 왜 중요한가?

도메인 모델을 단순 DTO 나열이 아니라, 비즈니스 규칙 중심으로 표현할 수 있게 도와줍니다.

## 면접 포인트

- DDD는 객체 이름 붙이기가 아니라, 도메인 경계와 규칙을 코드 구조에 반영하는 접근이라고 설명하면 좋습니다.
