---
id: "ts-mcq-001"
title: "TypeScript의 Exclude와 Omit에 대한 설명으로 올바른 것은?"
difficulty: "mid"
category: "typescript"
type: "mcq"
options:
  - text: "Exclude는 유니온에서 타입을 제거하고, Omit은 객체 타입에서 특정 키를 제거한다."
    correct: true
  - text: "Exclude와 Omit은 모두 런타임에 객체 프로퍼티를 삭제한다."
    correct: false
  - text: "Omit은 배열 타입에서 인덱스를 제거할 때만 사용할 수 있다."
    correct: false
  - text: "Exclude는 제네릭 타입이 아니라 클래스 상속에서만 사용할 수 있다."
    correct: false
---

`Exclude<T, U>`는 유니온 타입에서 일부 타입을 제거하고, `Omit<T, K>`는 객체 타입에서 특정 키를 제거한 새 타입을 만듭니다.
둘 다 컴파일 타임 타입 시스템에서 동작합니다.
