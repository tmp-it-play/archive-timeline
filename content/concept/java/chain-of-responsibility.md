---
id: "java-con-073"
title: "책임 연쇄 패턴(Chain of Responsibility)"
difficulty: "mid"
category: "java"
type: "concept"
---

## 책임 연쇄 패턴이란?

요청을 여러 처리자에게 순서대로 넘기며,
누군가 처리할 수 있으면 처리하게 하는 패턴입니다.

## 예시

- 인증/인가 필터 체인
- 예외 처리 체인
- 요청 검증 단계

## 장점

- 처리자 연결이 유연함
- 요청자와 실제 처리자를 느슨하게 분리

## 면접 포인트

- Spring Security Filter Chain 같은 예시와 연결하면 이해가 쉽습니다.
