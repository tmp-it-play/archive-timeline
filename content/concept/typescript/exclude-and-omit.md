---
id: "ts-con-001"
title: "TypeScript의 Exclude와 Omit"
difficulty: "mid"
category: "typescript"
type: "concept"
---

## Exclude란?

`Exclude<T, U>`는 유니온 타입 `T`에서 `U`에 해당하는 타입을 제거합니다.

```ts
type A = 'a' | 'b' | 'c'
type B = Exclude<A, 'a' | 'b'>
// 'c'
```

## 내부 동작 개념

핵심은 **조건부 타입의 분배(distributive conditional types)** 입니다.

직접 비슷하게 구현하면:

```ts
type MyExclude<T, U> = T extends U ? never : T
```

## Omit이란?

`Omit<T, K>`는 객체 타입 `T`에서 특정 키 `K`를 제거한 새 타입을 만듭니다.

```ts
type User = {
  id: string
  name: string
  password: string
}

type PublicUser = Omit<User, 'password'>
```

## Omit을 직접 구현하면?

보통 `Pick`과 `Exclude`를 조합합니다.

```ts
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

## 타입 추론 범위를 좁힌다는 것은?

TypeScript는 조건문, `typeof`, `in`, 사용자 정의 타입 가드 등을 통해 타입을 좁힙니다.
이를 **narrowing** 이라고 합니다.

```ts
function print(value: string | number) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase())
  } else {
    console.log(value.toFixed(2))
  }
}
```

## 면접 포인트

- `Exclude`는 유니온 필터링
- `Omit`은 객체 키 제거
- 둘 다 TypeScript 유틸리티 타입의 대표 예시라는 점을 설명하면 좋습니다.
