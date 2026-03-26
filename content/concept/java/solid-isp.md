---
id: "java-con-035"
title: "ISP: 인터페이스 분리 원칙"
difficulty: "mid"
category: "java"
type: "concept"
---

## ISP란?

클라이언트는 자신이 사용하지 않는 메서드에 의존하면 안 된다는 원칙입니다.

## 예시

너무 큰 인터페이스:

```java
interface Worker {
    void work();
    void eat();
    void sleep();
    void deploy();
}
```

어떤 구현체는 `deploy()`가 필요 없을 수도 있습니다.

## 해결 방향

역할 단위로 인터페이스를 더 작게 나누어 필요한 것만 의존하게 합니다.

## 면접 포인트

- ISP는 "인터페이스는 무조건 작아야 한다"보다, 불필요한 의존을 줄이는 원칙이라고 설명하면 좋습니다.
