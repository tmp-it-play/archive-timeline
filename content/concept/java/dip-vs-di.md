---
id: "java-con-040"
title: "DIP와 DI의 차이"
difficulty: "mid"
category: "java"
type: "concept"
---

## DIP

의존성 역전 원칙(Dependency Inversion Principle)입니다.
고수준 모듈과 저수준 모듈이 모두 추상화에 의존해야 한다는 설계 원칙입니다.

## DI

의존성 주입(Dependency Injection)입니다.
객체가 필요한 의존성을 외부에서 주입받는 구현 방식입니다.

## 차이

- DIP: 설계 원칙
- DI: 그 원칙을 구현하는 대표적인 방법

## 예시

서비스가 `UserRepository` 인터페이스에 의존하는 것은 DIP에 가깝고,
생성자 주입으로 구현체를 넣는 것은 DI에 가깝습니다.

## 면접 포인트

- DIP와 DI를 같은 말처럼 섞지 않는 것이 중요합니다.
