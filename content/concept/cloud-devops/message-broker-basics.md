---
id: "cloud-con-015"
title: "메시지 브로커를 왜 사용할까"
difficulty: "mid"
category: "cloud_devops"
type: "concept"
---

## 메시지 브로커란?

서비스 간 메시지를 중개하는 시스템입니다.

예:
- Kafka
- RabbitMQ
- SQS

## 왜 쓰나?

- 비동기 처리
- 서비스 간 느슨한 결합
- 트래픽 흡수
- 재시도/버퍼링

## 면접 포인트

- 메시지 브로커는 단순 큐가 아니라, 시스템 결합도를 낮추고 확장성을 높이는 데 중요한 역할을 합니다.
