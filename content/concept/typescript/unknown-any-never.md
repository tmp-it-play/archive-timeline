---
id: "ts-con-015"
title: "any, unknown, never 차이"
difficulty: "mid"
category: "typescript"
type: "concept"
---

## any

타입 검사를 사실상 우회합니다.

## unknown

값은 받을 수 있지만, 사용 전에 타입을 좁혀야 합니다.

## never

절대 값이 존재하지 않는 타입입니다.

예:
- 항상 예외를 던지는 함수
- 모든 경우를 처리한 뒤 남는 불가능한 분기

## 면접 포인트

- `any`보다 `unknown`이 더 안전하다는 점을 설명하면 좋습니다.
