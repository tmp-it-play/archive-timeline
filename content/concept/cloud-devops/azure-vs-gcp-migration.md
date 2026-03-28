---
id: "cloud-con-007"
title: "Azure를 쓰다가 GCP로 갈 때 생각할 점"
difficulty: "junior"
category: "cloud_devops"
type: "concept"
---

## 클라우드 마이그레이션에서 중요한 것

특정 상품 이름만 외우는 것보다, 현재 사용 중인 리소스를 대응 개념으로 옮겨 생각하는 것이 중요합니다.

예:
- VM
- Kubernetes
- Object Storage
- Managed DB
- IAM/권한 체계
- 네트워크/로드밸런서
- 로깅/모니터링

## Azure와 GCP를 비교할 때

### Kubernetes
- Azure: AKS
- GCP: GKE

### Object Storage
- Azure Blob Storage
- Google Cloud Storage

### IAM
- 역할/주체 모델은 비슷하지만 세부 구조와 운영 방식은 다름

## 마이그레이션 시 체크 포인트

- 네트워크 구조와 CIDR 충돌
- 권한 모델 재설계
- 로깅/모니터링 재구성
- 스토리지/DB 마이그레이션 방식
- CI/CD와 Secret 관리 방식

## 면접 포인트

- "둘 다 클라우드니까 비슷하다"가 아니라 운영 모델과 관리 포인트가 다르다고 말하는 것이 중요합니다.
