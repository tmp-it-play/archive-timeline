---
id: "java-con-036"
title: "DIP: 의존성 역전 원칙"
difficulty: "mid"
category: "java"
type: "concept"
---

## DIP란?

고수준 모듈이 저수준 구현체에 직접 의존하지 말고,
둘 다 추상화에 의존해야 한다는 원칙입니다.

## 예시

서비스가 `MysqlUserRepository`를 직접 new 하는 대신,
`UserRepository` 인터페이스에 의존하도록 설계합니다.

## 왜 중요한가?

- 테스트 더블 교체 쉬움
- 구현체 교체 쉬움
- 결합도 감소

## 면접 포인트

- DIP는 DI와 연결해서 설명하면 이해가 쉽습니다.
- DI는 수단이고, DIP는 설계 원칙입니다.
