---
id: "cloud-con-028"
title: "Docker 외 컨테이너 런타임과 기술들"
difficulty: "mid"
category: "cloud_devops"
type: "concept"
---

## Docker만 있는가?

아닙니다. Docker는 개발 경험과 패키징 도구로 유명하지만,
컨테이너 실행 생태계에는 여러 런타임이 있습니다.

## 대표 예시

- containerd
- CRI-O
- runc
- Podman

## 간단히 보면

- runc: OCI 표준 저수준 런타임
- containerd: 컨테이너 실행 관리
- CRI-O: Kubernetes 친화 런타임
- Podman: daemonless 컨테이너 도구

## 면접 포인트

- Docker를 "유일한 컨테이너 기술"처럼 말하지 않고, 생태계 안의 한 도구로 설명하면 좋습니다.
