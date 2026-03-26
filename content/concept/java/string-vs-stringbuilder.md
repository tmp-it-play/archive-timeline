---
id: "java-con-076"
title: "String과 StringBuilder의 차이"
difficulty: "junior"
category: "java"
type: "concept"
---

## String

- 불변(immutable)
- 문자열을 변경하는 것처럼 보여도 실제로는 새 객체가 만들어짐

## StringBuilder

- 가변(mutable)
- 문자열을 이어 붙이거나 수정하는 작업에 더 효율적

## 언제 무엇을 쓰나?

- 단순 문자열 표현, 안전한 값 객체: `String`
- 반복적인 문자열 조합: `StringBuilder`

## 면접 포인트

- 반복 concatenation에서는 `StringBuilder`가 더 효율적이라는 점을 자주 묻습니다.
