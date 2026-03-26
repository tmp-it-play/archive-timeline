---
id: "ts-con-009"
title: "TypeScript에서 mocking을 어떻게 볼까"
difficulty: "mid"
category: "typescript"
type: "concept"
---

## 왜 mocking을 쓰나?

외부 API, DB, 시간, 랜덤값 같은 요소를 통제하기 위해서입니다.

## 주의할 점

- 내부 구현 세부에 과도하게 묶이면 테스트가 취약해짐
- mock이 많아질수록 실제 동작과 괴리될 수 있음

## 좋은 방향

- 경계가 분명한 외부 의존성만 mock
- 핵심 비즈니스 로직은 가능한 한 순수 함수처럼 테스트

## 면접 포인트

- mock은 편리하지만 남용하면 테스트 신뢰도가 떨어질 수 있다고 설명하면 좋습니다.
