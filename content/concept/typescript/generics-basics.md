---
id: "ts-con-012"
title: "TypeScript 제네릭 기본"
difficulty: "junior"
category: "typescript"
type: "concept"
---

## 제네릭이란?

타입을 값처럼 매개변수화해서 재사용 가능한 타입/함수를 만드는 기능입니다.

## 예시

```ts
function identity<T>(value: T): T {
  return value
}
```

## 왜 필요한가?

- 타입 안정성 유지
- 중복 제거
- 재사용성 향상

## 면접 포인트

- 제네릭은 any를 쓰지 않고도 유연함을 확보하는 도구라고 설명하면 좋습니다.
