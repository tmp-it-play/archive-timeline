---
id: "db-mcq-007"
title: "N+1 문제에 대한 설명으로 가장 적절한 것은?"
difficulty: "mid"
category: "db"
type: "mcq"
options:
  - text: "연관 데이터를 지연 로딩하면서 추가 쿼리가 반복 발생해 쿼리 수가 급증하는 문제다."
    correct: true
  - text: "기본키가 N개, 외래키가 1개일 때만 생기는 스키마 문제다."
    correct: false
  - text: "네트워크 패킷이 하나 더 오는 현상이다."
    correct: false
  - text: "데이터베이스가 자동으로 인덱스를 삭제하는 문제다."
    correct: false
---

N+1 문제는 ORM 사용 시 자주 등장하는 대표 성능 이슈입니다.
