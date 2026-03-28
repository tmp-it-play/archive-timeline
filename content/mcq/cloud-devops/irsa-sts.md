---
id: "cloud-mcq-002"
title: "AWS EKS의 IRSA에서 STS가 하는 역할은 무엇인가?"
difficulty: "senior"
category: "cloud_devops"
type: "mcq"
options:
  - text: "Pod가 사용할 IAM Role의 임시 자격 증명을 발급한다."
    correct: true
  - text: "쿠버네티스 클러스터의 etcd를 백업한다."
    correct: false
  - text: "모든 네트워크 트래픽을 암호화한다."
    correct: false
  - text: "RDS 읽기 복제본을 자동 생성한다."
    correct: false
---

IRSA는 ServiceAccount와 IAM Role을 연결하고, STS는 그 역할에 대한 임시 자격 증명을 발급하는 핵심 구성 요소입니다.
