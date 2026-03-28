---
id: "cloud-con-023"
title: "Jenkins와 Kubernetes를 함께 쓸 때의 관점"
difficulty: "mid"
category: "cloud_devops"
type: "concept"
---

## 왜 같이 자주 나오나?

Jenkins는 CI/CD 파이프라인을 만들고,
Kubernetes는 배포 대상이 되거나 빌드 에이전트 실행 환경이 되기 때문입니다.

## 대표 시나리오

- Jenkins가 Docker 이미지 빌드
- 레지스트리에 푸시
- Kubernetes에 배포

## 고민 포인트

- 시크릿 관리
- 롤백 전략
- 배포 안정성
- 빌드 에이전트 확장성

## 면접 포인트

- Jenkins와 Kubernetes는 경쟁 관계가 아니라, 파이프라인과 배포 플랫폼 관계로 보는 것이 맞습니다.
