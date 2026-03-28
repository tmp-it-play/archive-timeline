---
id: "cloud-con-013"
title: "Presigned URL은 왜 주의해서 써야 할까"
difficulty: "junior"
category: "cloud_devops"
type: "concept"
---

## Presigned URL이란?

일정 시간 동안만 유효한 업로드/다운로드 URL입니다.

## 장점

- 애플리케이션 서버를 거치지 않고 파일 전송 가능
- 서버 부하 감소

## 보안상 주의점

- 탈취되면 유효 시간 동안 악용될 수 있음
- 업로드 후 서버 측 검증이 필요할 수 있음
- 파일 타입, 크기, 경로 제한을 걸어야 함

## 면접 포인트

- "서버를 안 거치니 편하다"에서 끝내지 말고, 검증과 만료 전략까지 말하면 좋습니다.
