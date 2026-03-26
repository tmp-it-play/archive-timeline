---
id: "cloud-con-018"
title: "컨테이너와 VM의 차이"
difficulty: "junior"
category: "cloud_devops"
type: "concept"
---

## VM

하이퍼바이저 위에서 게스트 OS 전체를 포함해 실행합니다.

## 컨테이너

호스트 OS 커널을 공유하면서 프로세스 격리 방식으로 실행합니다.

## 차이

- VM: 격리 강함, 무거움
- 컨테이너: 가벼움, 빠른 배포

## 면접 포인트

- 컨테이너는 OS 전체 가상화가 아니라 프로세스 수준 격리라고 설명하면 좋습니다.
