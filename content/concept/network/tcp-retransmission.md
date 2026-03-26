---
id: "net-con-033"
title: "TCP 재전송은 어떻게 동작할까"
difficulty: "mid"
category: "network"
type: "concept"
---

## 재전송이란?

전송한 데이터가 유실되었거나 ACK를 받지 못했을 때 다시 보내는 동작입니다.

## 왜 필요한가?

TCP는 신뢰성 있는 전송을 목표로 하기 때문입니다.

## 대표 단서

- 타임아웃
- 중복 ACK

## 면접 포인트

- TCP는 유실을 무시하지 않고 재전송으로 보완한다는 점이 핵심입니다.
