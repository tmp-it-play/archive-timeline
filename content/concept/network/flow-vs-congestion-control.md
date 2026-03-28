---
id: "net-con-004"
title: "TCP의 흐름 제어와 혼잡 제어"
difficulty: "junior"
category: "network"
type: "concept"
---

## 흐름 제어(Flow Control)

송신자가 수신자의 처리 속도를 넘지 않도록 조절하는 것입니다.
대표적으로 수신 윈도우(receiver window)를 사용합니다.

즉, **상대방이 받을 수 있는 만큼만 보내자**가 핵심입니다.

## 혼잡 제어(Congestion Control)

네트워크 전체가 혼잡해지는 것을 막기 위한 제어입니다.

즉, **네트워크가 감당할 수 있는 만큼만 보내자**가 핵심입니다.

대표 개념:
- slow start
- congestion avoidance
- fast retransmit

## 왜 UDP에는 이런 것이 없을까?

UDP는 단순성과 낮은 오버헤드를 목표로 설계되었습니다.
신뢰성, 순서 보장, 흐름 제어, 혼잡 제어를 기본 제공하지 않습니다.
필요하다면 애플리케이션 레벨에서 직접 구현해야 합니다.

## 면접 포인트

- 흐름 제어는 송신자-수신자 사이 문제
- 혼잡 제어는 네트워크 전체 문제
- 둘의 관점 차이를 분명히 설명하는 것이 중요합니다.
