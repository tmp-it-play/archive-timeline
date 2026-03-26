---
id: "java-con-029"
title: "JDK Dynamic Proxy와 CGLIB 차이"
difficulty: "senior"
category: "java"
type: "concept"
---

## JDK Dynamic Proxy

- 인터페이스 기반 프록시
- 대상 객체가 인터페이스를 구현해야 함

## CGLIB

- 클래스 상속 기반 프록시
- 인터페이스가 없어도 프록시 생성 가능
- final 클래스/메서드는 제약이 있음

## Spring에서 어떻게 쓰나?

- 인터페이스 기반이면 JDK Dynamic Proxy를 쓸 수 있음
- 필요하면 CGLIB 기반 프록시를 사용

## 면접 포인트

- 둘 다 프록시 생성 방식이지만, 인터페이스 기반인지 클래스 기반인지가 핵심 차이입니다.
