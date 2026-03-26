---
id: "db-mcq-002"
title: "외부 노출 식별자와 내부 PK를 분리하는 이유로 가장 적절한 것은?"
difficulty: "senior"
category: "db"
type: "mcq"
options:
  - text: "내부 식별 전략과 외부 공개 식별 전략의 요구사항이 다를 수 있어, 추론 방지와 변경 유연성을 확보하기 위해서다."
    correct: true
  - text: "자동 증가 PK는 인덱스를 전혀 사용할 수 없기 때문에 외부 노출이 금지된다."
    correct: false
  - text: "UUID는 항상 더 빠르므로 자동 증가 PK를 완전히 대체해야 한다."
    correct: false
  - text: "대체키를 사용하면 기본키가 필요 없어지므로 모든 테이블에서 PK를 제거할 수 있다."
    correct: false
---

내부 PK와 외부 공개용 식별자를 분리하면 보안적 추론 가능성을 낮추고, 시스템 내부 조인 전략은 유지하면서 외부 API 설계를 유연하게 가져갈 수 있습니다.
