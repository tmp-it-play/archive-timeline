---
id: "db-con-007"
title: "Elasticsearch를 왜 쓰고, RDB와 어떻게 다를까"
difficulty: "mid"
category: "db"
type: "concept"
---

## Elasticsearch란?

검색과 로그 분석에 강한 분산 검색 엔진입니다.
역색인(inverted index)을 기반으로 빠른 검색을 지원합니다.

## RDB와 차이

- RDB: 정합성과 관계형 조회에 강함
- Elasticsearch: 전문 검색, 집계, 분석에 강함

## 언제 쓰나?

- 검색어 자동완성
- 게시글/문서 검색
- 로그 분석
- 집계성 대시보드

## 면접 포인트

- Elasticsearch는 DB 대체재라기보다 "검색 특화 저장소"로 설명하는 것이 좋습니다.
