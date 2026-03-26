---
id: "net-con-003"
title: "HTTP 외 전송 방식과 gRPC를 어떻게 이해할까"
difficulty: "mid"
category: "network"
type: "concept"
---

## HTTP 외에 생각해볼 수 있는 전송 방식

면접에서 "HTTP 말고 무엇을 써봤나요?" 라는 질문은 보통 애플리케이션 레벨 통신 방식을 묻는 경우가 많습니다.

예를 들면:
- WebSocket
- gRPC
- Server-Sent Events (SSE)
- MQTT
- AMQP / Kafka 같은 메시징 기반 통신

## gRPC란?

gRPC는 Google이 만든 고성능 RPC(Remote Procedure Call) 프레임워크입니다.
주로 **HTTP/2 + Protocol Buffers** 조합 위에서 동작합니다.

## gRPC의 특징

### 1. 인터페이스 우선 설계
- `.proto` 파일로 요청/응답 구조와 서비스 인터페이스를 정의
- 여러 언어의 클라이언트/서버 코드를 생성 가능

### 2. 바이너리 직렬화
- JSON보다 작고 빠른 편
- 네트워크 대역폭과 파싱 비용을 줄이기 좋음

### 3. HTTP/2 기반
- 멀티플렉싱
- 헤더 압축
- 양방향 스트리밍 지원

## gRPC 스트리밍 종류

- Unary: 일반 요청 1개, 응답 1개
- Server Streaming: 요청 1개, 응답 여러 개
- Client Streaming: 요청 여러 개, 응답 1개
- Bidirectional Streaming: 양방향 여러 개

## 패킷에 어떤 정보가 들어가나?

질문이 "패킷 블록"을 말할 때는 보통 네트워크 계층/전송 계층 헤더를 포함해 설명하면 됩니다.

예:
- 출발지 IP, 목적지 IP
- 출발지 포트, 목적지 포트
- 순서 번호, 확인 응답 번호
- 플래그(SYN, ACK 등)
- 길이, 체크섬
- 실제 데이터(payload)

## 언제 gRPC를 고려할까?

- 마이크로서비스 간 내부 통신
- 다국어 서비스 간 계약 기반 API
- 고성능, 저지연 통신이 중요한 경우

## 언제 REST/JSON이 더 나을까?

- 브라우저 친화성이 중요할 때
- 외부 공개 API일 때
- 디버깅 편의성과 단순성이 더 중요할 때

## 면접 포인트

- gRPC는 "빠르다"에서 끝내지 말고 HTTP/2, Proto, 스트리밍까지 연결해서 설명하는 것이 좋습니다.
- 외부 공개 API와 내부 서비스 통신의 선택 기준을 비교하면 답변이 더 좋아집니다.
