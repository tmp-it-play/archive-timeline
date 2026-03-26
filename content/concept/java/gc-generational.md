---
id: "java-con-079"
title: "GC를 세대별로 이해하기"
difficulty: "senior"
category: "java"
type: "concept"
---

## 왜 세대별로 나누나?

대부분의 객체는 금방 죽고, 일부 객체만 오래 살아남는 경향이 있습니다.
이 특성을 활용해 GC 효율을 높이려는 것이 세대별 수집의 아이디어입니다.

## 보통 나누는 영역

- Young Generation
- Old Generation

## Young Generation

- 새로 생성된 객체가 주로 위치
- 비교적 자주 수집
- Minor GC가 일어남

## Old Generation

- 오래 살아남은 객체가 이동
- 더 무겁고 비용 큰 수집이 일어날 수 있음

## 면접 포인트

- GC는 단순 메모리 청소가 아니라, 객체 생존 패턴을 활용한 최적화라고 설명하면 좋습니다.
