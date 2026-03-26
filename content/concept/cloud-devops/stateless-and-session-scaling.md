---
id: "cloud-con-012"
title: "Stateless 서버와 Scale Out 환경의 세션 처리"
difficulty: "mid"
category: "cloud_devops"
type: "concept"
---

## 왜 Stateless가 중요한가?

scale out 환경에서는 어떤 서버가 요청을 받아도 처리 가능해야 합니다.
서버 내부 메모리에 사용자 상태를 들고 있으면 확장이 어려워집니다.

## 세션 처리는 어떻게 하나?

- Redis 같은 외부 세션 저장소
- JWT 기반 무상태 인증
- Sticky Session은 가능하지만 장기적으로는 유연성이 떨어질 수 있음

## 면접 포인트

- Stateless는 "상태가 아예 없다"가 아니라, 상태를 서버 인스턴스 로컬에 두지 않는다는 의미로 설명하면 좋습니다.
