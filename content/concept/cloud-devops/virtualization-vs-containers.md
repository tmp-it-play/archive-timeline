---
id: "cloud-con-029"
title: "가상화와 컨테이너를 더 넓게 보기"
difficulty: "junior"
category: "cloud_devops"
type: "concept"
---

## 전통적 가상화

하이퍼바이저 위에서 게스트 OS 전체를 실행합니다.

예:
- VMware
- KVM
- Hyper-V

## 컨테이너

호스트 커널을 공유하면서 프로세스 격리로 실행합니다.

예:
- Docker
- containerd 기반 컨테이너
- Podman

## 핵심 차이

- 가상화: OS 수준 격리
- 컨테이너: 프로세스 수준 격리

## 면접 포인트

- 컨테이너는 가상화의 대체재라기보다, 더 가벼운 격리/배포 모델로 설명하는 것이 좋습니다.
