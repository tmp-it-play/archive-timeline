---
id: "ts-con-013"
title: "interface와 type alias의 차이"
difficulty: "mid"
category: "typescript"
type: "concept"
---

## interface

객체 형태를 정의할 때 자주 사용합니다.
선언 병합 같은 특징이 있습니다.

## type alias

객체뿐 아니라 유니온, 튜플, 원시 타입 조합 등 더 넓은 표현이 가능합니다.

## 실무 관점

- 객체 구조 중심이면 interface
- 유니온/조합 타입이면 type alias

이런 식으로 쓰는 경우가 많습니다.

## 면접 포인트

- 둘을 무조건 하나로 통일하기보다, 표현하려는 타입의 성격에 따라 선택한다고 말하면 좋습니다.
