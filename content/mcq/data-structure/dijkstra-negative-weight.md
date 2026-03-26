---
id: "ds-mcq-001"
title: "다익스트라 알고리즘이 음수 가중치에서 실패할 수 있는 이유는?"
difficulty: "mid"
category: "data_structure"
type: "mcq"
options:
  - text: "한 번 최단 거리로 확정한 정점이 음수 간선 때문에 나중에 더 짧아질 수 있기 때문이다."
    correct: true
  - text: "음수 가중치가 있으면 그래프의 정점 수를 셀 수 없기 때문이다."
    correct: false
  - text: "우선순위 큐가 음수를 저장하지 못하기 때문이다."
    correct: false
  - text: "음수 간선이 있으면 모든 그래프가 반드시 순환 그래프가 되기 때문이다."
    correct: false
---

다익스트라는 현재 가장 짧다고 판단한 거리를 확정해 나가는 greedy 성질을 가지므로, 음수 간선이 있으면 이 전제가 깨질 수 있습니다.
