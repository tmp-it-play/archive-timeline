---
id: "ts-con-002"
title: "TypeScript의 타입 좁히기(Type Narrowing)"
difficulty: "mid"
category: "typescript"
type: "concept"
---

## 타입 좁히기란?

넓은 유니온 타입에서, 코드 흐름을 따라 더 구체적인 타입으로 추론 범위를 줄이는 기능입니다.

예:

```ts
function print(value: string | number) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase())
  } else {
    console.log(value.toFixed(2))
  }
}
```

## 어떤 방식으로 좁힐 수 있나?

- `typeof`
- `instanceof`
- `in`
- 사용자 정의 타입 가드
- 분기문과 제어 흐름 분석

## 왜 중요한가?

- 타입 단언을 남발하지 않아도 됨
- 런타임 오류를 줄이는 데 도움
- IDE 자동완성과 정적 검사가 더 정확해짐

## 면접 포인트

- TypeScript는 단순 선언형 타입 시스템이 아니라, 제어 흐름을 따라 타입을 추론하고 좁힐 수 있다는 점이 핵심입니다.
