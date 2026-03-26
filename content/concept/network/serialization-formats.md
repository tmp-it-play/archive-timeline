---
id: "net-con-008"
title: "JSON, ProtoBuf 등 직렬화 형식"
difficulty: "mid"
category: "network"
type: "concept"
---

## 직렬화란?

메모리 안의 객체/구조를 전송이나 저장 가능한 형태로 바꾸는 과정입니다.

## 대표 형식

- JSON
- XML
- Protocol Buffers
- MessagePack
- Avro
- YAML

## JSON

- 사람이 읽기 쉬움
- 웹 생태계와 궁합이 좋음
- 다만 크기가 크고 파싱 비용이 상대적으로 큼

## Protocol Buffers

- 스키마 기반 바이너리 형식
- 작고 빠름
- gRPC와 함께 자주 언급됨

## 어떻게 선택하나?

- 디버깅과 범용성: JSON
- 성능과 크기 최적화: ProtoBuf, MessagePack
- 스키마 진화가 중요: Avro 등

## 면접 포인트

- 형식 이름만 나열하지 말고 "사람 친화 vs 기계 친화" 관점으로 비교하면 좋습니다.
