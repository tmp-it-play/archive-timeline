---
id: "java-con-028"
title: "JoinPoint, Pointcut, Advice, Aspect 차이"
difficulty: "mid"
category: "java"
type: "concept"
---

## JoinPoint

부가 기능을 적용할 수 있는 지점입니다.
Spring AOP에서는 보통 메서드 실행 지점으로 생각하면 됩니다.

## Pointcut

수많은 JoinPoint 중에서 실제로 어디에 적용할지 고르는 조건입니다.

## Advice

실제로 실행되는 부가 로직입니다.
예: before, after, around

## Aspect

Pointcut과 Advice를 묶은 AOP 모듈입니다.

## 한 줄로 정리

- JoinPoint: 가능한 지점
- Pointcut: 고른 지점
- Advice: 실행할 로직
- Aspect: 이들을 묶은 단위

## 면접 포인트

- 용어를 섞지 않고 역할 단위로 구분해 설명하는 것이 중요합니다.
