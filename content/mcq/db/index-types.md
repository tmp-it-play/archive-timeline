---
id: "db-mcq-001"
title: "데이터베이스 인덱스에 대한 설명으로 올바른 것은?"
difficulty: "mid"
category: "db"
type: "mcq"
options:
  - text: "B-Tree 인덱스는 범위 검색에 효과적이다"
    correct: true
  - text: "인덱스가 많을수록 SELECT 성능이 항상 향상된다"
    correct: false
  - text: "Hash 인덱스는 범위 검색에 적합하다"
    correct: false
  - text: "클러스터드 인덱스는 테이블당 여러 개 생성할 수 있다"
    correct: false
---

### B-Tree 인덱스
가장 일반적인 인덱스 구조로, 데이터를 정렬된 트리 형태로 저장합니다.
- **장점**: 범위 검색(`BETWEEN`, `>`, `<`), 정렬, `LIKE 'prefix%'` 효율적
- MySQL InnoDB, PostgreSQL의 기본 인덱스 타입

### Hash 인덱스
해시 테이블 기반으로 **등호 검색(=)만** 효율적입니다.
- 범위 검색, 정렬에는 **부적합**

### 인덱스와 DML 성능
인덱스가 많으면 `SELECT` 성능은 향상되지만, `INSERT`, `UPDATE`, `DELETE` 성능은 저하됩니다.
인덱스도 갱신해야 하기 때문입니다.

### 클러스터드 인덱스
물리적 데이터 정렬 순서를 결정하므로 **테이블당 1개**만 가능합니다.
(InnoDB에서는 PK가 자동으로 클러스터드 인덱스)
