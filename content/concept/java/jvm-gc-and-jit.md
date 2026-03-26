---
id: "java-con-015"
title: "JVM 구조, GC, 그리고 JIT 컴파일러"
difficulty: "mid"
category: "java"
type: "concept"
---

## JVM의 역할

Java 바이트코드를 실행하는 가상 머신입니다.
운영체제와 하드웨어 차이를 추상화해 이식성을 제공합니다.

## JVM을 설명할 때 자주 나오는 요소

- Class Loader
- Runtime Data Area
- Execution Engine
- Garbage Collector

## JIT 컴파일러

자주 실행되는 바이트코드를 기계어로 최적화해 실행 성능을 높입니다.

## GC란?

더 이상 참조되지 않는 객체를 자동으로 정리하는 메모리 관리 방식입니다.

## 성능 영향

- GC pause가 길어지면 응답 지연이 커질 수 있음
- 객체 생성량이 많으면 GC 부담 증가

## 면접 포인트

- GC는 "자동 메모리 관리"이고, JIT는 "실행 성능 최적화"라고 구분하면 좋습니다.
