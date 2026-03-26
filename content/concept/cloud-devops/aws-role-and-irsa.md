---
id: "cloud-con-006"
title: "AWS Assume Role, STS, 그리고 IRSA"
difficulty: "mid"
category: "cloud_devops"
type: "concept"
---

## Assume Role이란?

AWS에서 다른 IAM Role의 권한을 임시로 위임받아 사용하는 방식입니다.
영구 Access Key를 직접 뿌리는 대신, 짧은 수명의 임시 자격 증명을 발급받아 씁니다.

## STS의 역할

STS(Security Token Service)는 이 임시 자격 증명을 발급하는 서비스입니다.

즉:
- 어떤 주체가
- 특정 Role을 Assume 하면
- STS가 임시 Access Key / Secret / Session Token을 발급

## IRSA란?

IRSA(IAM Roles for Service Accounts)는 EKS에서 Kubernetes ServiceAccount와 IAM Role을 연결하는 방식입니다.

## 왜 쓰나?

- Pod 안에 장기 자격 증명을 넣지 않아도 됨
- 서비스 단위 최소 권한 부여가 쉬움
- 보안 운영이 단순해짐

## 동작 개념

1. Pod가 ServiceAccount를 통해 신원 토큰을 가짐
2. AWS OIDC 신뢰 관계를 이용
3. STS가 해당 Role의 임시 자격 증명을 발급

## 면접 포인트

- Assume Role은 권한 위임
- STS는 임시 자격 증명 발급자
- IRSA는 이를 EKS Pod 단위로 적용한 방식이라고 설명하면 좋습니다.
