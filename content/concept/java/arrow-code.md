---
id: "java-con-082"
title: "애로우 코드(Arrow Code)와 중첩 제거 전략"
difficulty: "mid"
category: "java"
type: "concept"
---

## 애로우 코드란

조건문과 반복문이 깊게 중첩되어 코드가 오른쪽으로 점점 들여써지는 패턴입니다.
들여쓰기 모양이 화살표(▶)처럼 보여서 **애로우 코드(Arrow Code)** 또는 **피라미드 오브 둠(Pyramid of Doom)** 이라고 부릅니다.

```java
// 전형적인 애로우 코드
public void process(Order order) {
    if (order != null) {
        if (order.isValid()) {
            if (order.hasItems()) {
                for (Item item : order.getItems()) {
                    if (item.isAvailable()) {
                        if (item.getStock() > 0) {
                            ship(item);
                        }
                    }
                }
            }
        }
    }
}
```

중첩 깊이가 늘어날수록 가독성, 테스트 용이성, 유지보수성이 급격히 떨어집니다.

## 왜 문제인가

- **가독성 저하**: 실제 로직이 코드 오른쪽 끝에 묻혀버림
- **테스트 어려움**: 깊은 조건마다 별도 케이스가 필요
- **변경 비용 증가**: 한 조건 추가 시 들여쓰기 전체가 영향을 받음
- **단일 책임 위반**: 한 함수가 너무 많은 분기를 처리

## 해결 전략

### 1. Guard Clause (조기 반환)

조건이 실패하면 즉시 반환하여 else 중첩을 없앱니다.

```java
public void process(Order order) {
    if (order == null) return;
    if (!order.isValid()) return;
    if (!order.hasItems()) return;

    for (Item item : order.getItems()) {
        if (!item.isAvailable()) continue;
        if (item.getStock() <= 0) continue;
        ship(item);
    }
}
```

### 2. 메서드 추출 (Extract Method)

중첩된 블록을 별도 메서드로 분리합니다.

```java
public void process(Order order) {
    if (!isProcessable(order)) return;
    order.getItems().stream()
         .filter(this::isShippable)
         .forEach(this::ship);
}

private boolean isProcessable(Order order) {
    return order != null && order.isValid() && order.hasItems();
}

private boolean isShippable(Item item) {
    return item.isAvailable() && item.getStock() > 0;
}
```

### 3. Stream / 함수형 스타일

반복 + 조건 조합을 Stream으로 평탄화합니다.

```java
public void process(Order order) {
    if (order == null || !order.isValid()) return;

    order.getItems().stream()
         .filter(Item::isAvailable)
         .filter(item -> item.getStock() > 0)
         .forEach(this::ship);
}
```

### 4. 정책/전략 패턴으로 분기 제거

조건 분기가 비즈니스 규칙인 경우 Strategy 패턴으로 외부화합니다.

```java
public interface ShipPolicy {
    boolean canShip(Item item);
}

public class StockPolicy implements ShipPolicy {
    public boolean canShip(Item item) {
        return item.isAvailable() && item.getStock() > 0;
    }
}
```

## 적정 중첩 깊이

일반적으로 **3단계 이하**를 권장합니다.
린터 도구(Checkstyle, SonarQube)는 기본적으로 중첩 깊이 3~4를 경고합니다.

## 면접 포인트

- 애로우 코드는 **가독성과 유지보수성**을 해치는 안티패턴입니다.
- **Guard Clause**가 가장 직관적인 첫 번째 해결책입니다.
- Stream이나 메서드 추출로 중첩을 평탄화할 수 있습니다.
- 중첩 깊이가 깊어지면 **단일 책임 원칙 위반 신호**로 볼 수 있습니다.
