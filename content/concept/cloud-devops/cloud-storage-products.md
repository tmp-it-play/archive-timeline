---
id: "cloud-con-002"
title: "대표적인 클라우드 스토리지 상품들"
difficulty: "junior"
category: "cloud_devops"
type: "concept"
---

## 클라우드 스토리지란?

클라우드 사업자가 네트워크를 통해 제공하는 저장소 서비스입니다.
형태에 따라 객체 스토리지, 파일 스토리지, 블록 스토리지로 나눠 생각할 수 있습니다.

## 대표 상품 예시

### AWS
- Amazon S3: 객체 스토리지
- Amazon EBS: 블록 스토리지
- Amazon EFS: 파일 스토리지

### Google Cloud
- Google Cloud Storage: 객체 스토리지
- Persistent Disk: 블록 스토리지
- Filestore: 파일 스토리지

### Azure
- Azure Blob Storage: 객체 스토리지
- Azure Managed Disks: 블록 스토리지
- Azure Files: 파일 스토리지

### 기타
- Cloudflare R2: S3 호환 객체 스토리지
- Backblaze B2: 저비용 객체 스토리지

## 어떻게 구분할까?

### 객체 스토리지
- 이미지, 영상, 백업, 로그 아카이브
- 대용량 확장에 유리

### 블록 스토리지
- VM 디스크, DB 저장소
- 낮은 지연 시간과 안정적인 IOPS가 중요할 때 사용

### 파일 스토리지
- 여러 서버가 공유 파일 시스템처럼 사용할 때 적합

## 면접 포인트

- "스토리지"를 하나로 뭉개지 말고 객체/파일/블록으로 나누어 말하는 것이 중요합니다.
- S3만 말하고 끝내지 말고 어떤 워크로드에 쓰는지도 함께 설명하면 좋습니다.
