---
id: "java-con-077"
title: "String Pool이란?"
difficulty: "mid"
category: "java"
type: "concept"
---

## String Pool

동일한 문자열 리터럴을 재사용하기 위해 JVM이 관리하는 영역 개념입니다.

예:

```java
String a = "hello";
String b = "hello";
```

이 경우 같은 리터럴은 재사용될 수 있습니다.

## 왜 중요한가?

- 문자열 메모리 효율
- `==` 와 `equals()` 차이 질문과 연결

## 면접 포인트

- 문자열 비교에서는 보통 `equals()`를 써야 한다는 점까지 연결하면 좋습니다.
